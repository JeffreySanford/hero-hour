import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

void main() {
  runApp(const HeroHourApp());
}

class HeroHourApp extends StatefulWidget {
  const HeroHourApp({
    super.key,
    this.profileClient,
    this.initialAppState,
  });

  final http.Client? profileClient;
  final HeroHourAppState? initialAppState;

  @override
  State<HeroHourApp> createState() => _HeroHourAppState();
}

class _HeroHourAppState extends State<HeroHourApp> {
  late final HeroHourAppState _appState;

  @override
  void initState() {
    super.initState();
    _appState = widget.initialAppState ?? HeroHourAppState();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _appState,
      builder: (context, _) {
        return HeroHourScope(
          appState: _appState,
          child: MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'HeroHour',
            themeMode: _appState.darkMode ? ThemeMode.dark : ThemeMode.light,
            theme: _buildTheme(Brightness.light),
            darkTheme: _buildTheme(Brightness.dark),
            home: _appState.isAuthenticated
                ? HeroShell(profileClient: widget.profileClient)
                : LoginScreen(profileClient: widget.profileClient),
          ),
        );
      },
    );
  }
}

ThemeData _buildTheme(Brightness brightness) {
  final isDark = brightness == Brightness.dark;
  const gold = Color(0xFFFBBF24);
  final scheme = ColorScheme.fromSeed(
    brightness: brightness,
    seedColor: gold,
    primary: gold,
    secondary: const Color(0xFF22C55E),
    surface: isDark ? const Color(0xFF132238) : const Color(0xFFF7F3EA),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    splashFactory: NoSplash.splashFactory,
    scaffoldBackgroundColor: isDark
        ? const Color(0xFF08101D)
        : const Color(0xFFF1E8D7),
    textTheme: Typography.whiteMountainView.apply(
      bodyColor: isDark ? const Color(0xFFE5EDF7) : const Color(0xFF1D2430),
      displayColor: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF1D2430),
    ),
    appBarTheme: AppBarTheme(
      centerTitle: false,
      backgroundColor: Colors.transparent,
      foregroundColor: isDark ? Colors.white : const Color(0xFF1D2430),
      elevation: 0,
      scrolledUnderElevation: 0,
    ),
    cardTheme: CardThemeData(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(24),
        side: BorderSide(
          color: isDark ? const Color(0xFF2D435E) : const Color(0xFFD3BE90),
        ),
      ),
      color: isDark ? const Color(0xCC15263D) : const Color(0xFFF8F1E2),
      margin: EdgeInsets.zero,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: isDark ? const Color(0xFF0E1A2B) : const Color(0xFFFFFBF4),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(
          color: isDark ? const Color(0xFF4A6079) : const Color(0xFFD1B77A),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide(
          color: isDark ? const Color(0xFF4A6079) : const Color(0xFFD1B77A),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: gold, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
  );
}

class HeroHourScope extends InheritedNotifier<HeroHourAppState> {
  const HeroHourScope({
    required HeroHourAppState appState,
    required super.child,
    super.key,
  }) : super(notifier: appState);

  static HeroHourAppState of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<HeroHourScope>();
    assert(scope != null, 'HeroHourScope not found in widget tree.');
    return scope!.notifier!;
  }
}

class HeroHourAppState extends ChangeNotifier {
  HeroHourAppState({
    this.currentUser,
    this.accessToken,
    this.profileCompleted = false,
    this.darkMode = true,
    this.selectedActivity = '',
    this.offlineStatus = 'online',
    this.apiStatus = 'ok',
    this.hasApiError = false,
    this.queueCount = 2,
    WorldState? worldState,
    List<QuestItem>? quests,
    List<SideQuestItem>? sideQuests,
    LifeProfileFormValue? profile,
  }) : worldState =
           worldState ??
           WorldState(
             seed: 2407,
             color: 'Amber',
             icon: 'Forge',
             progress: 62,
           ),
       quests =
           quests ??
           [
             QuestItem(
               title: 'Prepare quarterly roadmap',
               lifeArea: 'career',
               progress: 70,
             ),
             QuestItem(
               title: 'Prototype customer onboarding flow',
               lifeArea: 'product',
               progress: 35,
             ),
           ],
       sideQuests =
           sideQuests ??
           [
             SideQuestItem(
               id: 'recover',
               title: 'Reset focus block',
               type: 'recovery',
               rewardXp: 15,
             ),
             SideQuestItem(
               id: 'review',
               title: 'Review sprint notes',
               type: 'team',
               rewardXp: 10,
             ),
           ],
       profile =
           profile ??
           const LifeProfileFormValue(
             firstName: '',
             lastName: '',
             age: 0,
             preferredRole: 'member',
           );

  HeroUser? currentUser;
  String? accessToken;
  bool profileCompleted;
  bool darkMode;
  String selectedActivity;
  String offlineStatus;
  String apiStatus;
  bool hasApiError;
  int queueCount;
  final WorldState worldState;
  final List<QuestSuggestion> suggestions = const [
    QuestSuggestion(title: 'Prepare quarterly roadmap', lifeArea: 'career'),
    QuestSuggestion(title: 'Run cross-team design review', lifeArea: 'career'),
    QuestSuggestion(
      title: 'Prototype customer onboarding flow',
      lifeArea: 'product',
    ),
    QuestSuggestion(title: 'Schedule sprint retrospective', lifeArea: 'team'),
    QuestSuggestion(
      title: 'Create personal daily standup ritual',
      lifeArea: 'health',
    ),
    QuestSuggestion(
      title: 'Finish article on DevOps efficiency',
      lifeArea: 'education',
    ),
  ];
  final List<QuestItem> quests;
  final List<SideQuestItem> sideQuests;
  LifeProfileFormValue profile;

  bool get isAuthenticated => accessToken != null && accessToken!.isNotEmpty;

  String get userInitials {
    final parts =
        currentUser?.fullName
            .split(' ')
            .where((part) => part.isNotEmpty)
            .toList() ??
        const [];
    if (parts.isEmpty) return '??';
    return parts.take(2).map((part) => part[0].toUpperCase()).join();
  }

  void login(String email, String password) {
    final cleanEmail = email.trim().toLowerCase();
    final cleanPassword = password.trim();
    if (cleanEmail.isEmpty || cleanPassword.isEmpty) {
      throw const FormatException('Enter your email and password.');
    }
    if (!cleanEmail.contains('@') || cleanPassword.length < 8) {
      throw const FormatException(
        'Use a valid email and an 8+ character password.',
      );
    }

    accessToken = 'hero-hour-demo-token';
    currentUser = HeroUser(fullName: 'Anne Lee', email: cleanEmail);
    if (!profileCompleted) {
      profile = const LifeProfileFormValue(
        firstName: '',
        lastName: '',
        age: 0,
        preferredRole: 'member',
      );
    }
    notifyListeners();
  }

  void logout() {
    accessToken = null;
    currentUser = null;
    notifyListeners();
  }

  void toggleDarkMode() {
    darkMode = !darkMode;
    notifyListeners();
  }

  void setActivity(String activity) {
    selectedActivity = activity;
    worldState.progress = (worldState.progress + 5).clamp(0, 100);
    queueCount = 0;
    notifyListeners();
  }

  void refreshStatus() {
    hasApiError = false;
    apiStatus = 'ok';
    notifyListeners();
  }

  void syncOffline() {
    offlineStatus = 'syncing';
    notifyListeners();
    offlineStatus = 'online';
    queueCount = 0;
    notifyListeners();
  }

  void chooseSuggestedQuest(QuestSuggestion suggestion) {
    addQuest(title: suggestion.title, lifeArea: suggestion.lifeArea);
  }

  void addQuest({required String title, required String lifeArea}) {
    final cleanTitle = title.trim();
    if (cleanTitle.isEmpty) {
      throw const FormatException('Please enter a quest title.');
    }
    quests.insert(
      0,
      QuestItem(title: cleanTitle, lifeArea: lifeArea, progress: 0),
    );
    notifyListeners();
  }

  void completeQuest(QuestItem quest) {
    quest.progress = 100;
    quest.status = 'complete';
    notifyListeners();
  }

  void claimSideQuest(String id) {
    final sideQuest = sideQuests.firstWhere((item) => item.id == id);
    sideQuest.completed = true;
    worldState.progress = (worldState.progress + 8).clamp(0, 100);
    notifyListeners();
  }

  void saveProfile(LifeProfileFormValue value) {
    profile = value;
    profileCompleted = true;
    notifyListeners();
  }
}

class HeroShell extends StatefulWidget {
  const HeroShell({super.key, this.profileClient});

  final http.Client? profileClient;

  @override
  State<HeroShell> createState() => _HeroShellState();
}

class _HeroShellState extends State<HeroShell> {
  int _selectedIndex = 0;
  bool _initializedIndex = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initializedIndex) {
      final appState = HeroHourScope.of(context);
      _selectedIndex = appState.profileCompleted ? 0 : 1;
      _initializedIndex = true;
    }
  }

  @override
  Widget build(BuildContext context) {
    final appState = HeroHourScope.of(context);
    final pages = [
      DashboardScreen(onOpenProfile: () => setState(() => _selectedIndex = 1)),
      LifeProfilePage(
        client: widget.profileClient,
        onSaved: () => setState(() => _selectedIndex = 0),
      ),
    ];

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const _BrandTitle(),
        actions: [
          TextButton(
            onPressed: appState.toggleDarkMode,
            child: Text(appState.darkMode ? 'Light Mode' : 'Dark Mode'),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 12),
            child: PopupMenuButton<String>(
              tooltip: 'Profile menu',
              onSelected: (value) {
                if (value == 'profile') {
                  setState(() => _selectedIndex = 1);
                } else if (value == 'logout') {
                  appState.logout();
                }
              },
              itemBuilder: (context) => const [
                PopupMenuItem(value: 'profile', child: Text('Life Profile')),
                PopupMenuItem(value: 'logout', child: Text('Logout')),
              ],
              child: CircleAvatar(
                radius: 18,
                backgroundColor: Theme.of(
                  context,
                ).colorScheme.primary.withValues(alpha: 0.2),
                child: Text(appState.userInitials),
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          const _AppBackdrop(),
          SafeArea(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 240),
              child: pages[_selectedIndex],
            ),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) =>
            setState(() => _selectedIndex = index),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.dashboard_customize_outlined),
            label: 'Dashboard',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, this.profileClient});

  final http.Client? profileClient;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'admin@example.com');
  final _passwordController = TextEditingController(text: 'password123');
  String? _error;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final appState = HeroHourScope.of(context);

    return Scaffold(
      body: Stack(
        children: [
          const _AppBackdrop(),
          SafeArea(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Login', style: theme.textTheme.headlineMedium),
                          const SizedBox(height: 8),
                          Text(
                            'Midnight Forge access for dashboard, profile, and quest management.',
                            style: theme.textTheme.bodyMedium,
                          ),
                          const SizedBox(height: 24),
                          TextField(
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                            decoration: const InputDecoration(
                              labelText: 'Email',
                              helperText:
                                  'Use your corporate or personal login address.',
                            ),
                          ),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _passwordController,
                            obscureText: true,
                            decoration: const InputDecoration(
                              labelText: 'Password',
                              helperText:
                                  'Must be 8+ characters and include a number.',
                            ),
                          ),
                          if (_error != null) ...[
                            const SizedBox(height: 12),
                            Text(
                              _error!,
                              style: TextStyle(color: theme.colorScheme.error),
                            ),
                          ],
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: FilledButton(
                              onPressed: () {
                                setState(() => _error = null);
                                try {
                                  appState.login(
                                    _emailController.text,
                                    _passwordController.text,
                                  );
                                } on FormatException catch (error) {
                                  setState(() => _error = error.message);
                                }
                              },
                              child: const Text('Login'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key, required this.onOpenProfile});

  final VoidCallback onOpenProfile;

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final _questTitleController = TextEditingController();
  String _selectedLifeArea = 'health';
  String? _formError;

  @override
  Widget build(BuildContext context) {
    final appState = HeroHourScope.of(context);
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Dashboard', style: theme.textTheme.headlineMedium),
                  const SizedBox(height: 4),
                  Text(
                    'Midnight Forge',
                    style: theme.textTheme.labelLarge?.copyWith(
                      color: theme.colorScheme.primary,
                      letterSpacing: 1.1,
                    ),
                  ),
                ],
              ),
            ),
            TextButton(
              onPressed: widget.onOpenProfile,
              child: const Text('New Profile'),
            ),
          ],
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _InfoCard(
              width: 360,
              title: 'API Status',
              badge: _StatusBadge(
                label: appState.hasApiError ? 'Offline' : appState.apiStatus,
                tone: appState.hasApiError
                    ? BadgeTone.error
                    : BadgeTone.success,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Connection: ${appState.offlineStatus}'),
                  const SizedBox(height: 12),
                  FilledButton.tonal(
                    onPressed: appState.refreshStatus,
                    child: const Text('Refresh status'),
                  ),
                ],
              ),
            ),
            _InfoCard(
              width: 360,
              title: 'World Seed State',
              badge: _RealmBadge(label: appState.worldState.color),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Seed: ${appState.worldState.seed}'),
                  Text('Icon: ${appState.worldState.icon}'),
                  const SizedBox(height: 12),
                  LinearProgressIndicator(
                    value: appState.worldState.progress / 100,
                  ),
                  const SizedBox(height: 8),
                  Text('Progress: ${appState.worldState.progress}%'),
                ],
              ),
            ),
            _InfoCard(
              width: 360,
              title: 'Sync Status',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Connection: ${appState.offlineStatus}'),
                  Text('Queue: ${appState.queueCount} pending actions'),
                  const SizedBox(height: 12),
                  OutlinedButton(
                    onPressed: appState.offlineStatus == 'online'
                        ? appState.syncOffline
                        : null,
                    child: const Text('Sync queued actions'),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _InfoCard(
          title: 'Realm Activity',
          child: Wrap(
            spacing: 8,
            runSpacing: 8,
            children: const [
              'exercise',
              'work',
              'social',
              'rest',
            ].map((activity) => _ActivityChip(activity: activity)).toList(),
          ),
        ),
        const SizedBox(height: 16),
        _InfoCard(
          title: 'Quests (Life Area)',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                controller: _questTitleController,
                decoration: const InputDecoration(labelText: 'New quest title'),
              ),
              const SizedBox(height: 12),
              DropdownButtonFormField<String>(
                initialValue: _selectedLifeArea,
                items: const [
                  DropdownMenuItem(value: 'health', child: Text('Health')),
                  DropdownMenuItem(value: 'career', child: Text('Career')),
                  DropdownMenuItem(
                    value: 'relationships',
                    child: Text('Relationships'),
                  ),
                  DropdownMenuItem(value: 'fun', child: Text('Fun')),
                  DropdownMenuItem(
                    value: 'education',
                    child: Text('Education'),
                  ),
                  DropdownMenuItem(value: 'team', child: Text('Team')),
                  DropdownMenuItem(value: 'product', child: Text('Product')),
                ],
                onChanged: (value) =>
                    setState(() => _selectedLifeArea = value ?? 'health'),
                decoration: const InputDecoration(labelText: 'Quest life area'),
              ),
              const SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () {
                    setState(() => _formError = null);
                    try {
                      appState.addQuest(
                        title: _questTitleController.text,
                        lifeArea: _selectedLifeArea,
                      );
                      _questTitleController.clear();
                    } on FormatException catch (error) {
                      setState(() => _formError = error.message);
                    }
                  },
                  child: const Text('Add Quest'),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Tip: choose a suggested quest to tap instantly',
                style: theme.textTheme.bodySmall,
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: appState.suggestions
                    .map(
                      (suggestion) => ActionChip(
                        label: Text(suggestion.title),
                        onPressed: () =>
                            appState.chooseSuggestedQuest(suggestion),
                      ),
                    )
                    .toList(),
              ),
              if (_formError != null) ...[
                const SizedBox(height: 12),
                Text(
                  _formError!,
                  style: TextStyle(color: theme.colorScheme.error),
                ),
              ],
              const SizedBox(height: 16),
              if (appState.quests.isEmpty)
                const _EmptyState(
                  title: 'No quests yet',
                  body:
                      'Start by adding your first quest for life progress tracking.',
                )
              else
                ...appState.quests.map(
                  (quest) => ListTile(
                    contentPadding: EdgeInsets.zero,
                    title: Text(quest.title),
                    subtitle: Text(
                      '${quest.lifeArea} • ${quest.status} • ${quest.progress}%',
                    ),
                    trailing: quest.status == 'complete'
                        ? const _StatusBadge(
                            label: 'Completed',
                            tone: BadgeTone.success,
                          )
                        : FilledButton.tonal(
                            onPressed: () => appState.completeQuest(quest),
                            child: const Text('Complete'),
                          ),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        _InfoCard(
          title: 'Side Quests (Quick Wins)',
          child: appState.sideQuests.isEmpty
              ? const _EmptyState(
                  title: 'No side quests available',
                  body:
                      'Rest, exercise, and progress at your own pace; side quests will appear when available.',
                )
              : Column(
                  children: appState.sideQuests
                      .map(
                        (sideQuest) => Card(
                          margin: const EdgeInsets.only(bottom: 10),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        sideQuest.title,
                                        style: theme.textTheme.titleMedium,
                                      ),
                                    ),
                                    _StatusBadge(
                                      label: sideQuest.completed
                                          ? 'Completed'
                                          : 'Available',
                                      tone: sideQuest.completed
                                          ? BadgeTone.success
                                          : BadgeTone.warning,
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  '${sideQuest.type.toUpperCase()} • +${sideQuest.rewardXp} XP',
                                ),
                                const SizedBox(height: 10),
                                Align(
                                  alignment: Alignment.centerRight,
                                  child: sideQuest.completed
                                      ? const SizedBox.shrink()
                                      : TextButton(
                                          onPressed: () => appState
                                              .claimSideQuest(sideQuest.id),
                                          child: const Text('Claim'),
                                        ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
        ),
      ],
    );
  }

  @override
  void dispose() {
    _questTitleController.dispose();
    super.dispose();
  }
}

class LifeProfilePage extends StatefulWidget {
  const LifeProfilePage({super.key, this.client, this.onSaved});

  final http.Client? client;
  final VoidCallback? onSaved;

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
  bool _didSeedForm = false;

  static const _userId = 'demo-user';
  static const _baseUrl = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'http://localhost:3000/api',
  );

  http.Client get _client => widget.client ?? http.Client();

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_didSeedForm) {
      final profile = HeroHourScope.of(context).profile;
      _firstNameController.text = profile.firstName;
      _lastNameController.text = profile.lastName;
      _ageController.text = profile.age > 0 ? '${profile.age}' : '';
      _preferredRole = profile.preferredRole;
      _didSeedForm = true;
    }
  }

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
        throw Exception(
          'Create failed: ${createResp.statusCode} ${createResp.body}',
        );
      }

      final getResp = await _client.get(
        Uri.parse('$_baseUrl/life-profile/$_userId'),
      );
      if (getResp.statusCode != 200) {
        throw Exception('Fetch failed: ${getResp.statusCode} ${getResp.body}');
      }

      final body = jsonDecode(getResp.body) as Map<String, dynamic>;
      HeroHourScope.of(context).saveProfile(
        LifeProfileFormValue(
          firstName: '${body['firstName'] ?? ''}',
          lastName: '${body['lastName'] ?? ''}',
          age: body['age'] as int? ?? 0,
          preferredRole: '${body['preferredRole'] ?? 'member'}',
        ),
      );

      setState(() {
        _statusMessage =
            'Saved and fetched profile for ${body['firstName'] ?? 'user'}';
        _firstNameController.text = '${body['firstName'] ?? ''}';
        _lastNameController.text = '${body['lastName'] ?? ''}';
        _ageController.text = '${body['age'] ?? ''}';
        _preferredRole = '${body['preferredRole'] ?? 'member'}';
      });
      widget.onSaved?.call();
    } catch (error) {
      setState(() {
        _statusMessage = 'Error: $error';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      children: [
        Text('Life Profile', style: theme.textTheme.headlineMedium),
        const SizedBox(height: 6),
        Text(
          'Match the Angular form flow with the same fields, validation, and save/fetch feedback.',
          style: theme.textTheme.bodyMedium,
        ),
        const SizedBox(height: 16),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  TextFormField(
                    controller: _firstNameController,
                    decoration: const InputDecoration(labelText: 'First name'),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Required'
                        : null,
                  ),
                  const SizedBox(height: 12),
                  TextFormField(
                    controller: _lastNameController,
                    decoration: const InputDecoration(labelText: 'Last name'),
                    validator: (value) => value == null || value.trim().isEmpty
                        ? 'Required'
                        : null,
                  ),
                  const SizedBox(height: 12),
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
                  const SizedBox(height: 12),
                  DropdownButtonFormField<String>(
                    initialValue: _preferredRole,
                    decoration: const InputDecoration(
                      labelText: 'Preferred role',
                    ),
                    items: const [
                      DropdownMenuItem(value: 'leader', child: Text('Leader')),
                      DropdownMenuItem(value: 'member', child: Text('Member')),
                      DropdownMenuItem(
                        value: 'observer',
                        child: Text('Observer'),
                      ),
                    ],
                    onChanged: (value) {
                      if (value != null) {
                        setState(() => _preferredRole = value);
                      }
                    },
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: FilledButton(
                      onPressed: _isLoading ? null : _submit,
                      child: Text(
                        _isLoading ? 'Saving...' : 'Save Life Profile',
                      ),
                    ),
                  ),
                  if (_statusMessage.isNotEmpty) ...[
                    const SizedBox(height: 16),
                    Text(_statusMessage),
                  ],
                ],
              ),
            ),
          ),
        ),
      ],
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

class _AppBackdrop extends StatelessWidget {
  const _AppBackdrop();

  @override
  Widget build(BuildContext context) {
    final darkMode = HeroHourScope.of(context).darkMode;

    return DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: darkMode
              ? const [Color(0xFF050816), Color(0xFF101A32), Color(0xFF16253B)]
              : const [Color(0xFFF7F1E2), Color(0xFFE6D4AB), Color(0xFFF7F3EA)],
        ),
      ),
      child: const SizedBox.expand(),
    );
  }
}

class _BrandTitle extends StatelessWidget {
  const _BrandTitle();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          Icons.shield_moon_outlined,
          color: Theme.of(context).colorScheme.primary,
        ),
        const SizedBox(width: 10),
        Flexible(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'HeroHour',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              Text(
                'Midnight Forge',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.labelSmall?.copyWith(
                  color: Theme.of(context).colorScheme.primary,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({
    required this.title,
    required this.child,
    this.badge,
    this.width,
  });

  final String title;
  final Widget child;
  final Widget? badge;
  final double? width;

  @override
  Widget build(BuildContext context) {
    final card = Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    title,
                    style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                if (badge != null) badge!,
              ],
            ),
            const SizedBox(height: 16),
            child,
          ],
        ),
      ),
    );

    if (width == null) return card;
    return SizedBox(width: width, child: card);
  }
}

enum BadgeTone { success, warning, error }

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({required this.label, required this.tone});

  final String label;
  final BadgeTone tone;

  @override
  Widget build(BuildContext context) {
    final colors = switch (tone) {
      BadgeTone.success => const (Color(0x3322C55E), Color(0xFF86EFAC)),
      BadgeTone.warning => const (Color(0x33FBBF24), Color(0xFFFDE68A)),
      BadgeTone.error => const (Color(0x33EF4444), Color(0xFFFCA5A5)),
    };

    return DecoratedBox(
      decoration: BoxDecoration(
        color: colors.$1,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: colors.$2.withValues(alpha: 0.6)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        child: Text(
          label,
          style: TextStyle(color: colors.$2, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}

class _RealmBadge extends StatelessWidget {
  const _RealmBadge({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return DecoratedBox(
      decoration: BoxDecoration(
        color: const Color(0xFFF59E0B),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        child: Text(
          label,
          style: const TextStyle(
            color: Color(0xFF1F2937),
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}

class _ActivityChip extends StatelessWidget {
  const _ActivityChip({required this.activity});

  final String activity;

  @override
  Widget build(BuildContext context) {
    final appState = HeroHourScope.of(context);
    final selected = appState.selectedActivity == activity;

    return ChoiceChip(
      label: Text('${activity[0].toUpperCase()}${activity.substring(1)}'),
      selected: selected,
      onSelected: (_) => appState.setActivity(activity),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.title, required this.body});

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 6),
          Text(body),
        ],
      ),
    );
  }
}

class HeroUser {
  HeroUser({required this.fullName, required this.email});

  final String fullName;
  final String email;
}

class WorldState {
  WorldState({
    required this.seed,
    required this.color,
    required this.icon,
    required this.progress,
  });

  final int seed;
  final String color;
  final String icon;
  int progress;
}

class QuestSuggestion {
  const QuestSuggestion({required this.title, required this.lifeArea});

  final String title;
  final String lifeArea;
}

class QuestItem {
  QuestItem({
    required this.title,
    required this.lifeArea,
    required this.progress,
    this.status = 'pending',
  });

  final String title;
  final String lifeArea;
  int progress;
  String status;
}

class SideQuestItem {
  SideQuestItem({
    required this.id,
    required this.title,
    required this.type,
    required this.rewardXp,
    this.completed = false,
  });

  final String id;
  final String title;
  final String type;
  final int rewardXp;
  bool completed;
}

class LifeProfileFormValue {
  const LifeProfileFormValue({
    required this.firstName,
    required this.lastName,
    required this.age,
    required this.preferredRole,
  });

  final String firstName;
  final String lastName;
  final int age;
  final String preferredRole;
}
