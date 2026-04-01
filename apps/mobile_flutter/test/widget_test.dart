// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:mobile_flutter/main.dart';

void main() {
  testWidgets('fill form, click Save, assert success message appears', (WidgetTester tester) async {
    final mockClient = MockClient((request) async {
      if (request.method == 'POST' && request.url.path.endsWith('/life-profile')) {
        return http.Response('{}', 201);
      }
      if (request.method == 'GET' && request.url.path.endsWith('/life-profile/demo-user')) {
        return http.Response(
          '{"userId":"demo-user","firstName":"Anne","lastName":"Lee","age":32,"preferredRole":"member"}',
          200,
        );
      }
      return http.Response('Not found', 404);
    });

    await tester.pumpWidget(MaterialApp(home: LifeProfilePage(client: mockClient)));

    final firstNameField = find.byType(TextFormField).at(0);
    final lastNameField = find.byType(TextFormField).at(1);
    final ageField = find.byType(TextFormField).at(2);

    await tester.enterText(firstNameField, 'Anne');
    await tester.enterText(lastNameField, 'Lee');
    await tester.enterText(ageField, '32');

    await tester.tap(find.text('Save Life Profile'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Save Life Profile'));
    await tester.pumpAndSettle();

    expect(find.textContaining('Saved and fetched profile for Anne'), findsOneWidget);
  });
}

