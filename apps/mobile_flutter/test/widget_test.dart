import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:mobile_flutter/main.dart';

HeroHourApp _buildApp({http.Client? client, HeroHourAppState? state}) {
  return HeroHourApp(profileClient: client, initialAppState: state);
}

Future<void> _pumpThroughPrologue(WidgetTester tester, {Duration? duration}) async {
  await tester.pump(duration ?? const Duration(milliseconds: 2200));
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('no token renders login screen', (WidgetTester tester) async {
    await tester.pumpWidget(_buildApp());
    await _pumpThroughPrologue(tester);

    expect(find.widgetWithText(FilledButton, 'Login'), findsOneWidget);
    expect(find.text('Dashboard'), findsNothing);
  });

  testWidgets('token and completed profile render dashboard', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      _buildApp(
        state: HeroHourAppState(
          accessToken: 'token',
          currentUser: HeroUser(
            fullName: 'Anne Lee',
            email: 'admin@example.com',
          ),
          profileCompleted: true,
          profile: const LifeProfileFormValue(
            firstName: 'Anne',
            lastName: 'Lee',
            age: 32,
            preferredRole: 'member',
          ),
        ),
      ),
    );
    await _pumpThroughPrologue(tester);

    expect(find.text('New Profile'), findsOneWidget);
    expect(find.text('Life Profile'), findsNothing);
  });

  testWidgets('failed login shows error', (WidgetTester tester) async {
    await tester.pumpWidget(_buildApp());
    await _pumpThroughPrologue(tester);

    await tester.enterText(find.byType(TextField).at(0), 'bad-email');
    await tester.enterText(find.byType(TextField).at(1), 'short');
    await tester.tap(find.widgetWithText(FilledButton, 'Login'));
    await tester.pumpAndSettle();

    expect(
      find.text('Use a valid email and an 8+ character password.'),
      findsOneWidget,
    );
  });

  testWidgets('completed-profile login sets token and lands on dashboard', (
    WidgetTester tester,
  ) async {
    final state = HeroHourAppState(profileCompleted: true);
    await tester.pumpWidget(_buildApp(state: state));
    await _pumpThroughPrologue(tester);

    await tester.tap(find.widgetWithText(FilledButton, 'Login'));
    await tester.pumpAndSettle();

    expect(state.accessToken, 'hero-hour-demo-token');
    expect(find.text('New Profile'), findsOneWidget);
    expect(find.text('Life Profile'), findsNothing);
  });

  testWidgets(
    'first-run login lands on life profile and save returns to dashboard',
    (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(800, 1200));
      addTearDown(() => tester.binding.setSurfaceSize(null));

      final mockClient = MockClient((request) async {
        if (request.method == 'POST' &&
            request.url.path.endsWith('/life-profile')) {
          return http.Response('{}', 201);
        }
        if (request.method == 'GET' &&
            request.url.path.endsWith('/life-profile/demo-user')) {
          return http.Response(
            '{"userId":"demo-user","firstName":"Anne","lastName":"Lee","age":32,"preferredRole":"member"}',
            200,
          );
        }
        return http.Response('Not found', 404);
      });

      await tester.pumpWidget(_buildApp(client: mockClient));
      await _pumpThroughPrologue(tester);

      await tester.tap(find.widgetWithText(FilledButton, 'Login'));
      await tester.pumpAndSettle();

      expect(find.text('Life Profile'), findsOneWidget);
      expect(find.text('New Profile'), findsNothing);

      await tester.enterText(find.byType(TextFormField).at(0), 'Anne');
      await tester.enterText(find.byType(TextFormField).at(1), 'Lee');
      await tester.enterText(find.byType(TextFormField).at(2), '32');

      final saveProfileButton = find.widgetWithText(
        FilledButton,
        'Save Life Profile',
      );
      await tester.tap(saveProfileButton);
      await tester.pumpAndSettle();

      expect(find.text('New Profile'), findsOneWidget);
      expect(find.text('Life Profile'), findsNothing);
    },
  );

  test('claiming a side quest updates app state and world progress', () {
    final appState = HeroHourAppState();

    final beforeProgress = appState.worldState.progress;
    final beforeXp = appState.xp;
    expect(appState.sideQuests.first.completed, isFalse);

    appState.claimSideQuest('recover');

    expect(appState.sideQuests.first.completed, isTrue);
    expect(appState.worldState.progress, equals((beforeProgress + 8).clamp(0, 100)));
    expect(appState.xp, beforeXp + 15);
    expect(appState.currentIdentityMilestone.stage, 'pathfinder');
  });

  test('completing a quest uses complete endpoint and syncs world state', () async {
    final appState = HeroHourAppState();
    final quest = appState.quests.first;
    final initialWorld = appState.worldState.progress;

    final mockClient = MockClient((request) async {
      if (request.url.path.endsWith('/complete')) {
        return http.Response(
          jsonEncode({
            'quest': {
              'id': quest.id,
              'userId': quest.id,
              'title': quest.title,
              'lifeArea': quest.lifeArea,
              'status': 'complete',
              'progress': 100,
            },
            'worldState': {
              'seed': appState.worldState.seed + 10,
              'color': appState.worldState.color,
              'icon': appState.worldState.icon,
              'progress': (initialWorld + 10).clamp(0, 100),
            },
            'profile': {
              'userId': 'demo-user',
              'avatar': 'pathfinder',
              'theme': 'ember',
              'displayName': 'Anne Lee',
              'xp': 55,
              'level': 1,
              'streak': 0,
            },
          }),
          200,
        );
      }
      if (request.url.path.endsWith('/world-state')) {
        return http.Response(
          jsonEncode({
            'seed': appState.worldState.seed + 10,
            'color': appState.worldState.color,
            'icon': appState.worldState.icon,
            'progress': (initialWorld + 10).clamp(0, 100),
          }),
          200,
        );
      }
      return http.Response('Not found', 404);
    });

    await appState.completeQuest(quest, client: mockClient);

    expect(quest.status, 'complete');
    expect(quest.syncStatus, 'confirmed');
    expect(appState.worldState.progress, (initialWorld + 10).clamp(0, 100));
    expect(appState.xp, 55);
    expect(appState.currentIdentityMilestone.title, 'Quest Pathfinder');
  });

  test('daily time grid cells list generation includes completed entries', () {
    final appState = HeroHourAppState();
    appState.worldState.progress = 50; // 12 slots complete
    appState.quests.first.status = 'complete';

    final cells = appState.dailyTimeGridCells;

    expect(cells.length, 24);
    expect(cells.where((cell) => cell.completed).length, greaterThanOrEqualTo(12));
    expect(cells.where((cell) => cell.activity == 'work').length, greaterThanOrEqualTo(12));
  });

  testWidgets('dashboard displays daily time grid', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
    );

    await tester.pumpWidget(_buildApp(state: appState));
    await _pumpThroughPrologue(tester);

    expect(appState.prologueComplete, isTrue);
    expect(find.text('New Profile'), findsOneWidget);

    await tester.drag(find.byType(ListView), const Offset(0, -900));
    await tester.pumpAndSettle();

    expect(find.text('Daily Time Grid'), findsOneWidget);
    expect(find.byType(DailyTimeGrid), findsOneWidget);
    expect(find.byType(GridView), findsOneWidget);
  });

  testWidgets('dashboard standalone includes daily time grid', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
    );

    await tester.pumpWidget(
      HeroHourScope(
        appState: appState,
        child: MaterialApp(
          home: DashboardScreen(onOpenProfile: () {}),
        ),
      ),
    );

    await tester.pumpAndSettle();
    expect(find.text('Dashboard'), findsOneWidget);

    await tester.drag(find.byType(ListView), const Offset(0, -900));
    await tester.pumpAndSettle();

    final foundTexts = find
        .byType(Text)
        .evaluate()
        .map((element) => (element.widget as Text).data)
        .whereType<String>()
        .toList();

    expect(foundTexts.contains('Daily Time Grid'), isTrue);
    expect(find.byType(DailyTimeGrid), findsOneWidget);
    expect(find.byType(GridView), findsOneWidget);
  });

  testWidgets('identity progression card is visible with milestone details', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
      xp: 45,
    );

    await tester.pumpWidget(
      HeroHourScope(
        appState: appState,
        child: MaterialApp(home: DashboardScreen(onOpenProfile: () {})),
      ),
    );

    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('identity-card')),
      400,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();

    expect(find.text('Identity Progression'), findsOneWidget);
    expect(find.text('Quest Pathfinder'), findsOneWidget);
    expect(find.text('pathfinder'), findsWidgets);
    expect(find.textContaining('Unlocked avatars'), findsOneWidget);
    expect(find.textContaining('Tempo Captain'), findsOneWidget);
  });

  testWidgets('strategy profile section shows recommendations and dimensions', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
    );

    appState.quests.clear();
    appState.quests.addAll([
      QuestItem(id: 'q1', title: 'A', lifeArea: 'career', progress: 100),
      QuestItem(id: 'q2', title: 'B', lifeArea: 'health', progress: 40),
    ]);
    appState.sideQuests.clear();
    appState.sideQuests.addAll([
      SideQuestItem(id: 's1', title: 'S', type: 'daily', rewardXp: 10, completed: true),
    ]);

    await tester.pumpWidget(
      HeroHourScope(
        appState: appState,
        child: MaterialApp(
          home: DashboardScreen(onOpenProfile: () {}),
        ),
      ),
    );

    await tester.pumpAndSettle();
    await tester.drag(find.byType(ListView), const Offset(0, -1800));
    await tester.pumpAndSettle();

    expect(find.textContaining('Re-entry summary'), findsOneWidget);
    expect(find.textContaining('Recommendations'), findsOneWidget);
    expect(find.text('Planning consistency'), findsOneWidget);
    expect(find.text('Recovery quality'), findsOneWidget);
  });

  testWidgets('strategy profile section is visible with dimensions and recommendations', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
    );

    appState.quests.clear();
    appState.quests.addAll(
      [
        QuestItem(id: 'q1', title: 'A', lifeArea: 'career', progress: 100),
        QuestItem(id: 'q2', title: 'B', lifeArea: 'health', progress: 30),
      ],
    );
    appState.sideQuests.clear();
    appState.sideQuests.addAll(
      [
        SideQuestItem(id: 's1', title: 'X', type: 'daily', rewardXp: 5, completed: true),
      ],
    );

    await tester.pumpWidget(
      HeroHourScope(
        appState: appState,
        child: MaterialApp(
          home: DashboardScreen(onOpenProfile: () {}),
        ),
      ),
    );

    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.byKey(const ValueKey('strategy-profile-card')),
      400,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();

    expect(find.textContaining('Re-entry summary'), findsOneWidget);
    expect(find.text('Planning consistency'), findsOneWidget);
    expect(find.text('Life-area balance'), findsOneWidget);
    expect(find.text('Recommendations'), findsOneWidget);
  });

  testWidgets('empty state shows guiding message when no quests exist', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
    );
    appState.quests.clear();
    appState.sideQuests.clear();

    await tester.pumpWidget(
      HeroHourScope(
        appState: appState,
        child: MaterialApp(home: DashboardScreen(onOpenProfile: () {})),
      ),
    );

    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(find.text('No quests yet'), 400, scrollable: find.byType(Scrollable).first);
    expect(find.text('No quests yet'), findsOneWidget);
    expect(find.textContaining('Start by adding your first quest'), findsOneWidget);
  });

  test('prologue duration is reduced in reduced motion mode', () {
    final appState = HeroHourAppState();
    appState.reduceMotion = true;
    expect(appState.prologueDuration, const Duration(milliseconds: 350));
  });

  testWidgets('computeStrategyRecommendations returns expected type for sample state', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
    );

    appState.quests.clear();
    appState.quests.addAll([
      QuestItem(id: 'q1', title: 'A', lifeArea: 'career', progress: 20),
      QuestItem(id: 'q2', title: 'B', lifeArea: 'health', progress: 100),
    ]);

    appState.sideQuests.clear();
    appState.sideQuests.addAll([
      SideQuestItem(id: 's1', title: 'X', type: 'daily', rewardXp: 5, completed: true),
    ]);

    appState.worldState.progress = 80;

    // Need to pump widget to instantiate DashboardScreen state so we can invoke its method.
    await tester.pumpWidget(
      HeroHourScope(
        appState: appState,
        child: MaterialApp(home: DashboardScreen(onOpenProfile: () {})),
      ),
    );

    await tester.pumpAndSettle();

    final state = tester.state(find.byType(DashboardScreen)) as dynamic;
    final recommendations = state.computeStrategyRecommendations(appState) as List<dynamic>;

    expect(recommendations, isNotEmpty);
    expect(recommendations.any((r) => r['type'] == 'momentum'), isTrue);
  });

  test('animate completion pins and clears status with a small delay', () async {
    final appState = HeroHourAppState();
    final questId = appState.quests.first.id;
    final sideQuestId = appState.sideQuests.first.id;

    appState.activateCompletionAnimation(
      questId: questId,
      sideQuestId: sideQuestId,
      duration: const Duration(milliseconds: 50),
    );

    expect(appState.recentlyCompletedQuestId, questId);
    expect(appState.recentlyClaimedSideQuestId, sideQuestId);

    await Future.delayed(const Duration(milliseconds: 70));

    expect(appState.recentlyCompletedQuestId, isNull);
    expect(appState.recentlyClaimedSideQuestId, isNull);
  });

  test('activation resets overlapping animation timers when invoked rapidly', () async {
    final appState = HeroHourAppState();

    appState.activateCompletionAnimation(
      questId: appState.quests.first.id,
      duration: const Duration(milliseconds: 500),
    );
    appState.activateCompletionAnimation(
      questId: appState.quests.last.id,
      duration: const Duration(milliseconds: 500),
    );

    expect(appState.recentlyCompletedQuestId, appState.quests.last.id);

    await Future.delayed(const Duration(milliseconds: 550));
    expect(appState.recentlyCompletedQuestId, isNull);
  });

  test('triple activation uses last trigger and clears previous', () async {
    final appState = HeroHourAppState();

    appState.activateCompletionAnimation(questId: 'q1', duration: const Duration(milliseconds: 600));
    appState.activateCompletionAnimation(questId: 'q2', duration: const Duration(milliseconds: 600));
    appState.activateCompletionAnimation(questId: 'q3', duration: const Duration(milliseconds: 600));

    expect(appState.recentlyCompletedQuestId, 'q3');

    await Future.delayed(const Duration(milliseconds: 200));
    expect(appState.recentlyCompletedQuestId, 'q3');

    await Future.delayed(const Duration(milliseconds: 500));
    expect(appState.recentlyCompletedQuestId, isNull);
  });

  test('reduced motion mode uses shortened animation timing', () async {
    final appState = HeroHourAppState();
    appState.reduceMotion = true;

    appState.activateCompletionAnimation(
      questId: appState.quests.first.id,
      duration: const Duration(milliseconds: 1000),
    );

    await Future.delayed(const Duration(milliseconds: 550));
    expect(appState.recentlyCompletedQuestId, isNull);
  });

  testWidgets('reduced motion disables heavy quest scale transitions', (
    WidgetTester tester,
  ) async {
    final appState = HeroHourAppState(
      profileCompleted: true,
      accessToken: 'abc',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
      reduceMotion: true,
    );

    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(disableAnimations: true),
        child: _buildApp(state: appState),
      ),
    );

    await tester.pump();

    expect(appState.reduceMotion, isTrue);

    // If reduced motion is enabled, completion animation timing should be brief and not use heavy transforms.
    appState.activateCompletionAnimation(
      questId: appState.quests.first.id,
      duration: const Duration(milliseconds: 1000),
    );
    await tester.pump(const Duration(milliseconds: 350));
    expect(appState.recentlyCompletedQuestId, isNull);
  });

  testWidgets('helper text and form validation hints are visible', (
    WidgetTester tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 1200));
    addTearDown(() => tester.binding.setSurfaceSize(null));

    final mockClient = MockClient((request) async {
      if (request.method == 'POST' &&
          request.url.path.endsWith('/life-profile')) {
        return http.Response('{}', 201);
      }
      if (request.method == 'GET' &&
          request.url.path.endsWith('/life-profile/demo-user')) {
        return http.Response(
          '{"userId":"demo-user","firstName":"Anne","lastName":"Lee","age":32,"preferredRole":"member"}',
          200,
        );
      }
      return http.Response('Not found', 404);
    });

    await tester.pumpWidget(_buildApp(client: mockClient));
    await _pumpThroughPrologue(tester);

    expect(
      find.text('Use your corporate or personal login address.'),
      findsOneWidget,
    );
    expect(
      find.text('Must be 8+ characters and include a number.'),
      findsOneWidget,
    );

    await tester.tap(find.byType(TextField).first);
  });

  testWidgets('cold start shows PrologueScreen and eventually login', (WidgetTester tester) async {
    await tester.pumpWidget(_buildApp());

    expect(find.text('HeroHour'), findsOneWidget);
    expect(find.text('Time begins'), findsOneWidget);

    await tester.pump(const Duration(milliseconds: 2500));
    await tester.pumpAndSettle();

    expect(find.widgetWithText(FilledButton, 'Login'), findsOneWidget);
  });

  testWidgets('warm start completes prologue quickly and renders dashboard', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
      profileCompleted: true,
      profile: const LifeProfileFormValue(firstName: 'Anne', lastName: 'Lee', age: 32, preferredRole: 'member'),
    );
    await tester.pumpWidget(_buildApp(state: appState));

    expect(find.text('Time begins'), findsOneWidget);

    await tester.pump(const Duration(milliseconds: 800));
    await tester.pumpAndSettle();

    expect(find.text('New Profile'), findsOneWidget);
  });

  testWidgets('reduced motion prologue is short and non-cinematic', (WidgetTester tester) async {
    final appState = HeroHourAppState(
      accessToken: 'token',
      currentUser: HeroUser(fullName: 'Anne Lee', email: 'a@example.com'),
      profileCompleted: true,
      // update in AppState for reduced motion behavior
      // `reduceMotion` is controlled via MediaQuery override in widget test.
    );

    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(disableAnimations: true),
        child: _buildApp(state: appState),
      ),
    );

    expect(find.text('HeroHour'), findsOneWidget);
    await tester.pump(const Duration(milliseconds: 500));
    await tester.pumpAndSettle();

    expect(find.text('New Profile'), findsOneWidget);
  });
}

