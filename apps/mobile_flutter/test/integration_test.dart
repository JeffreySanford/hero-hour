import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;

void main() {
  const apiBase = String.fromEnvironment('LIFE_PROFILE_API_BASE', defaultValue: 'http://localhost:3333/api');
  const enabled = bool.fromEnvironment('ENABLE_FLUTTER_API_INTEGRATION', defaultValue: false);

  test('live life-profile API path', () async {
    if (!enabled) {
      return;
    }

    const userId = 'integration-user';

    final payload = {
      'userId': userId,
      'firstName': 'API',
      'lastName': 'Integration',
      'age': 45,
      'preferredRole': 'member',
    };

    final create = await http.post(
      Uri.parse('$apiBase/life-profile'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(payload),
    );

    expect(create.statusCode, anyOf([200, 201]));

    final fetch = await http.get(Uri.parse('$apiBase/life-profile/$userId'));
    expect(fetch.statusCode, 200);

    final body = jsonDecode(fetch.body) as Map<String, dynamic>;
    expect(body['userId'], userId);
    expect(body['firstName'], 'API');
    expect(body['preferredRole'], 'member');
  }, timeout: const Timeout(Duration(minutes: 2)));
}
