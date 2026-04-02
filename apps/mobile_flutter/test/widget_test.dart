import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:mobile_flutter/main.dart';

HeroHourApp _buildApp({http.Client? client, HeroHourAppState? state}) {
  return HeroHourApp(profileClient: client, initialAppState: state);
}

void main() {
  testWidgets('no token renders login screen', (WidgetTester tester) async {
    await tester.pumpWidget(_buildApp());

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
    await tester.pumpAndSettle();

    expect(find.text('New Profile'), findsOneWidget);
    expect(find.text('Life Profile'), findsNothing);
  });

  testWidgets('failed login shows error', (WidgetTester tester) async {
    await tester.pumpWidget(_buildApp());

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

    expect(
      find.text('Use your corporate or personal login address.'),
      findsOneWidget,
    );
    expect(
      find.text('Must be 8+ characters and include a number.'),
      findsOneWidget,
    );

    await tester.tap(find.byType(TextField).first);
    await tester.pump();
    expect(tester.testTextInput.isVisible, isTrue);

    await tester.tap(find.widgetWithText(FilledButton, 'Login'));
    await tester.pumpAndSettle();

    expect(find.text('Life Profile'), findsOneWidget);

    final firstProfileField = find.byType(TextFormField).first;
    await tester.ensureVisible(firstProfileField);
    await tester.showKeyboard(firstProfileField);
    await tester.pump();
    expect(tester.testTextInput.isVisible, isTrue);

    final saveLifeProfileButton = find.widgetWithText(
      FilledButton,
      'Save Life Profile',
    );
    await tester.ensureVisible(saveLifeProfileButton);
    await tester.tap(saveLifeProfileButton);
    await tester.pumpAndSettle();

    expect(find.text('Required'), findsNWidgets(2));
    expect(find.text('Age must be 1-120'), findsOneWidget);
  });
}
