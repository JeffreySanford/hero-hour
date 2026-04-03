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
    expect(appState.sideQuests.first.completed, isFalse);

    appState.claimSideQuest('recover');

    expect(appState.sideQuests.first.completed, isTrue);
    expect(appState.worldState.progress, equals((beforeProgress + 8).clamp(0, 100)));
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

    appState.activateCompletionAnimation(questId: 'q1', duration: const Duration(milliseconds: 400));
    appState.activateCompletionAnimation(questId: 'q2', duration: const Duration(milliseconds: 400));
    appState.activateCompletionAnimation(questId: 'q3', duration: const Duration(milliseconds: 400));

    expect(appState.recentlyCompletedQuestId, 'q3');

    await Future.delayed(const Duration(milliseconds: 399));
    expect(appState.recentlyCompletedQuestId, 'q3');

    await Future.delayed(const Duration(milliseconds: 1));
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

