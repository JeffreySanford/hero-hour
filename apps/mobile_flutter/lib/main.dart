import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'HeroHour Life Profile',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
      ),
      home: const LifeProfilePage(),
    );
  }
}

class LifeProfilePage extends StatefulWidget {
  const LifeProfilePage({super.key, this.client});

  final http.Client? client;

  @override
  State<LifeProfilePage> createState() => _LifeProfilePageState();
}

class _LifeProfilePageState extends State<LifeProfilePage> {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _ageController = TextEditingController();
  String _preferredRole = 'member';
  String _statusMessage = '';
  bool _isLoading = false;

  static const _userId = 'demo-user';
  static const _baseUrl = String.fromEnvironment('API_BASE', defaultValue: 'http://localhost:3000/api');

  http.Client get _client => widget.client ?? http.Client();

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final payload = {
      'userId': _userId,
      'firstName': _firstNameController.text.trim(),
      'lastName': _lastNameController.text.trim(),
      'age': int.tryParse(_ageController.text) ?? 0,
      'preferredRole': _preferredRole,
    };

    setState(() {
      _isLoading = true;
      _statusMessage = 'Saving...';
    });

    try {
      final createResp = await _client.post(
        Uri.parse('$_baseUrl/life-profile'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(payload),
      );

      if (createResp.statusCode != 201 && createResp.statusCode != 200) {
        throw Exception('Create failed: ${createResp.statusCode} ${createResp.body}');
      }

      final getResp = await _client.get(Uri.parse('$_baseUrl/life-profile/$_userId'));
      if (getResp.statusCode != 200) {
        throw Exception('Fetch failed: ${getResp.statusCode} ${getResp.body}');
      }

      final body = jsonDecode(getResp.body) as Map<String, dynamic>;

      setState(() {
        _statusMessage = 'Saved and fetched profile for ${body['firstName'] ?? 'user'}';
        _firstNameController.text = '${body['firstName'] ?? ''}';
        _lastNameController.text = '${body['lastName'] ?? ''}';
        _ageController.text = '${body['age'] ?? ''}';
        _preferredRole = '${body['preferredRole'] ?? 'member'}';
      });
    } catch (e) {
      setState(() {
        _statusMessage = 'Error: $e';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Life Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Form(
                key: _formKey,
                child: Column(
                  children: [
                    TextFormField(
                      controller: _firstNameController,
                      decoration: const InputDecoration(labelText: 'First name'),
                      validator: (value) => value == null || value.trim().isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _lastNameController,
                      decoration: const InputDecoration(labelText: 'Last name'),
                      validator: (value) => value == null || value.trim().isEmpty ? 'Required' : null,
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _ageController,
                      decoration: const InputDecoration(labelText: 'Age'),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        final number = int.tryParse(value ?? '');
                        if (number == null || number < 1 || number > 120) {
                          return 'Age must be 1-120';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: _preferredRole,
                      decoration: const InputDecoration(labelText: 'Preferred role'),
                      items: const [
                        DropdownMenuItem(value: 'leader', child: Text('Leader')),
                        DropdownMenuItem(value: 'member', child: Text('Member')),
                        DropdownMenuItem(value: 'observer', child: Text('Observer')),
                      ],
                      onChanged: (v) {
                        if (v != null) {
                          setState(() {
                            _preferredRole = v;
                          });
                        }
                      },
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _submit,
                        child: Text(_isLoading ? 'Saving...' : 'Save Life Profile'),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(_statusMessage),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _firstNameController.dispose();
    _lastNameController.dispose();
    _ageController.dispose();
    super.dispose();
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      // This call to setState tells the Flutter framework that something has
      // changed in this State, which causes it to rerun the build method below
      // so that the display can reflect the updated values. If we changed
      // _counter without calling setState(), then the build method would not be
      // called again, and so nothing would appear to happen.
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return Scaffold(
      appBar: AppBar(
        // TRY THIS: Try changing the color here to a specific color (to
        // Colors.amber, perhaps?) and trigger a hot reload to see the AppBar
        // change color while the other colors stay the same.
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        // Center is a layout widget. It takes a single child and positions it
        // in the middle of the parent.
        child: Column(
          // Column is also a layout widget. It takes a list of children and
          // arranges them vertically. By default, it sizes itself to fit its
          // children horizontally, and tries to be as tall as its parent.
          //
          // Column has various properties to control how it sizes itself and
          // how it positions its children. Here we use mainAxisAlignment to
          // center the children vertically; the main axis here is the vertical
          // axis because Columns are vertical (the cross axis would be
          // horizontal).
          //
          // TRY THIS: Invoke "debug painting" (choose the "Toggle Debug Paint"
          // action in the IDE, or press "p" in the console), to see the
          // wireframe for each widget.
          mainAxisAlignment: .center,
          children: [
            const Text('You have pushed the button this many times:'),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
