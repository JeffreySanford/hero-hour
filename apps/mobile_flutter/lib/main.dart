import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

const _gold = Color(0xFFFBBF24);
const _teal = Color(0xFF22D3EE);
const _ink = Color(0xFF07111F);
const _night = Color(0xFF0F1728);
const _steel = Color(0xFF17253D);
const _cardTop = Color(0xFF21344D);
const _cardBottom = Color(0xFF0D1727);
const _mutedText = Color(0xFF94A3B8);
const _bodyText = Color(0xFFE2E8F0);
const _success = Color(0xFF22C55E);
const _warning = Color(0xFFF59E0B);
const _danger = Color(0xFFEF4444);

const _apiBaseUrl = String.fromEnvironment('API_BASE', defaultValue: 'http://localhost:3000/api');

void main() {
  runApp(const HeroHourApp());
}

class HeroHourApp extends StatefulWidget {
  const HeroHourApp({super.key, this.profileClient, this.initialAppState});

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
            home: _appState.prologueComplete
        ? (_appState.isAuthenticated
            ? HeroShell(profileClient: widget.profileClient)
            : LoginScreen(profileClient: widget.profileClient))
        : PrologueScreen(appState: _appState),
          ),
        );
      },
    );
  }
}

class PrologueScreen extends StatefulWidget {
  const PrologueScreen({super.key, required this.appState});

  final HeroHourAppState appState;

  @override
  State<PrologueScreen> createState() => _PrologueScreenState();
}

class _PrologueScreenState extends State<PrologueScreen> {
  late final Duration _duration;
  int _step = 0;
  Timer? _progressTimer;
  Timer? _fallbackTimer;

  @override
  void initState() {
    super.initState();
    _duration = widget.appState.prologueDuration;
    final stepDuration = Duration(milliseconds: (_duration.inMilliseconds / 4).ceil());

    _progressTimer = Timer.periodic(stepDuration, (timer) {
      if (!mounted) return;
      if (_step >= 3) {
        timer.cancel();
      }
      setState(() => _step = (_step + 1).clamp(0, 4));
    });

    Timer(_duration, _completePrologue);

    _fallbackTimer = Timer(const Duration(seconds: 8), () {
      if (!widget.appState.prologueComplete) {
        widget.appState.completePrologue();
      }
    });
  }

  void _completePrologue() {
    if (!widget.appState.prologueComplete) {
      widget.appState.completePrologue();
    }
  }

  @override
  void dispose() {
    _progressTimer?.cancel();
    _fallbackTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final shouldReduce = MediaQuery.of(context).disableAnimations;
    if (widget.appState.reduceMotion != shouldReduce) {
      widget.appState.reduceMotion = shouldReduce;
    }

    final steps = ['Time begins', 'Grid activates', 'Tasks check', 'World ignites', 'Ready'];
    final activeStep = _step.clamp(0, steps.length - 1);

    final progress = (activeStep + 1) / steps.length;

    return Scaffold(
      backgroundColor: _ink,
      body: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.currency_bitcoin, size: 80, color: _gold),
              const SizedBox(height: 18),
              Text(
                'HeroHour',
                style: Theme.of(context).textTheme.displaySmall?.copyWith(color: _gold),
              ),
              const SizedBox(height: 12),
              Text(
                steps[activeStep],
                style: Theme.of(context).textTheme.titleLarge?.copyWith(color: _bodyText),
              ),
              const SizedBox(height: 22),
              LinearProgressIndicator(
                value: progress,
                color: _teal,
                backgroundColor: _steel,
                minHeight: widget.appState.reduceMotion ? 4 : 8,
              ),
              const SizedBox(height: 16),
              if (_fallbackTimer != null && _fallbackTimer!.isActive)
                const Text('Loading...', style: TextStyle(color: Colors.white70)),
              if (_fallbackTimer != null && !_fallbackTimer!.isActive)
                TextButton(
                  onPressed: _completePrologue,
                  child: const Text('Continue', style: TextStyle(color: _gold)),
                ),
            ],
          ),
        ),
      ),
    );
  }
}


ThemeData _buildTheme(Brightness brightness) {
  final isDark = brightness == Brightness.dark;
  final scheme = ColorScheme.fromSeed(
    brightness: brightness,
    seedColor: _gold,
    primary: _gold,
    secondary: _teal,
    surface: isDark ? const Color(0xFF132238) : const Color(0xFFF7F3EA),
  );

  final baseText = isDark
      ? Typography.whiteMountainView
      : Typography.blackMountainView;
  final textTheme = baseText.copyWith(
    displayLarge: baseText.displayLarge?.copyWith(
      fontSize: 48,
      fontWeight: FontWeight.w800,
      letterSpacing: 1.4,
      height: 0.98,
      color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF1D2430),
    ),
    displaySmall: baseText.displaySmall?.copyWith(
      fontWeight: FontWeight.w700,
      letterSpacing: 0.8,
      color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF1D2430),
    ),
    headlineMedium: baseText.headlineMedium?.copyWith(
      fontSize: 34,
      fontWeight: FontWeight.w800,
      letterSpacing: 0.8,
      color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF1D2430),
    ),
    titleLarge: baseText.titleLarge?.copyWith(
      fontWeight: FontWeight.w700,
      letterSpacing: 0.4,
      color: isDark ? const Color(0xFFF8FAFC) : const Color(0xFF1D2430),
    ),
    titleMedium: baseText.titleMedium?.copyWith(
      fontWeight: FontWeight.w700,
      color: isDark ? _bodyText : const Color(0xFF1D2430),
    ),
    bodyMedium: baseText.bodyMedium?.copyWith(
      color: isDark ? _bodyText : const Color(0xFF334155),
      height: 1.55,
    ),
    bodySmall: baseText.bodySmall?.copyWith(
      color: isDark ? _mutedText : const Color(0xFF64748B),
      height: 1.45,
    ),
    labelLarge: baseText.labelLarge?.copyWith(
      fontWeight: FontWeight.w700,
      letterSpacing: 1.4,
    ),
    labelSmall: baseText.labelSmall?.copyWith(
      fontWeight: FontWeight.w700,
      letterSpacing: 1.6,
    ),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    splashFactory: NoSplash.splashFactory,
    scaffoldBackgroundColor: isDark ? _ink : const Color(0xFFF1E8D7),
    textTheme: textTheme,
    dividerColor: isDark ? const Color(0xFF2C3D57) : const Color(0xFFD5C18D),
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
          color: isDark ? const Color(0xFF30445F) : const Color(0xFFD3BE90),
        ),
      ),
      color: isDark ? const Color(0xC917263D) : const Color(0xFFF8F1E2),
      margin: EdgeInsets.zero,
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: isDark
          ? const Color(0xE60A1322)
          : const Color(0xFFF6EEDC),
      indicatorColor: _gold.withValues(alpha: 0.16),
      labelTextStyle: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return textTheme.labelMedium?.copyWith(
          color: selected
              ? _gold
              : (isDark ? _mutedText : const Color(0xFF475569)),
          fontWeight: selected ? FontWeight.w700 : FontWeight.w600,
        );
      }),
      iconTheme: WidgetStateProperty.resolveWith((states) {
        final selected = states.contains(WidgetState.selected);
        return IconThemeData(
          color: selected
              ? _gold
              : (isDark ? _mutedText : const Color(0xFF475569)),
        );
      }),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: _gold,
        foregroundColor: const Color(0xFF08101D),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        textStyle: textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: isDark ? _bodyText : const Color(0xFF1D2430),
        side: BorderSide(
          color: isDark ? const Color(0xFF3D516A) : const Color(0xFFD1B77A),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 15),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      ),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: isDark ? _bodyText : const Color(0xFF1D2430),
        textStyle: textTheme.labelLarge,
      ),
    ),
    chipTheme: ChipThemeData(
      backgroundColor: isDark
          ? const Color(0xFF0E1A2B)
          : const Color(0xFFF8F1E2),
      selectedColor: _gold.withValues(alpha: 0.22),
      disabledColor: Colors.grey.shade400,
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
      side: BorderSide(
        color: isDark ? const Color(0xFF38506B) : const Color(0xFFD7BD82),
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
      labelStyle: textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
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
        borderSide: const BorderSide(color: _gold, width: 1.5),
      ),
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
    ),
    popupMenuTheme: PopupMenuThemeData(
      color: isDark ? const Color(0xFF0E1A2B) : Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(
          color: isDark ? const Color(0xFF324861) : const Color(0xFFD7BD82),
        ),
      ),
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
    this.avatar = 'default',
    this.themeName = 'default',
    this.displayName = '',
    this.xp = 35,
    this.level = 1,
    this.streak = 0,
    this.darkMode = true,
    this.selectedActivity = '',
    this.offlineStatus = 'online',
    this.apiStatus = 'ok',
    this.hasApiError = false,
    this.questSyncState = 'idle',
    this.questSyncError,
    this.queueCount = 2,
    this.reduceMotion = false,
    WorldState? worldState,
    List<QuestItem>? quests,
    List<SideQuestItem>? sideQuests,
    WeeklyChallenge? weeklyChallenge,
    LifeProfileFormValue? profile,
  }) : worldState =
           worldState ??
           WorldState(seed: 2407, color: 'Amber', icon: 'Forge', progress: 62),
       weeklyChallenge = weeklyChallenge ??
         WeeklyChallenge(
           id: 'weekly-1',
           title: 'Win 5 weekly quests',
           description: 'Complete 5 quests this week to earn bonus XP',
           target: 5,
         ),
       quests =
           quests ??
           [
             QuestItem(
               id: 'prepare-quarterly-roadmap',
               title: 'Prepare quarterly roadmap',
               lifeArea: 'career',
               progress: 70,
             ),
             QuestItem(
               id: 'prototype-customer-onboarding',
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
           ) {
    _reconcileIdentity(notify: false);
  }

  HeroUser? currentUser;
  String? accessToken;
  bool profileCompleted;
  String avatar;
  String themeName;
  String displayName;
  int xp;
  int level;
  int streak;
  bool darkMode;
  String selectedActivity;
  String offlineStatus;
  String apiStatus;
  bool hasApiError;
  String questSyncState;
  String? questSyncError;

  // Animation-tracking state for completion celebration.
  String? recentlyCompletedQuestId;
  String? recentlyClaimedSideQuestId;
  bool reduceMotion = false;
  Timer? _completionAnimationTimer;
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
  final WeeklyChallenge weeklyChallenge;
  LifeProfileFormValue profile;

  bool prologueComplete = false;

  IdentityMilestone get currentIdentityMilestone {
    return _identityMilestones.lastWhere(
      (milestone) => xp >= milestone.requiredXp,
      orElse: () => _identityMilestones.first,
    );
  }

  IdentityMilestone? get nextIdentityMilestone {
    for (final milestone in _identityMilestones) {
      if (milestone.requiredXp > xp) {
        return milestone;
      }
    }
    return null;
  }

  List<String> get unlockedAvatars => _identityMilestones
      .where((milestone) => xp >= milestone.requiredXp)
      .map((milestone) => milestone.avatar)
      .toSet()
      .toList();

  List<String> get unlockedThemes => _identityMilestones
      .where((milestone) => xp >= milestone.requiredXp)
      .map((milestone) => milestone.theme)
      .toSet()
      .toList();

  int get nextIdentityXp => nextIdentityMilestone?.requiredXp ?? currentIdentityMilestone.requiredXp;

  String get nextIdentityLabel => nextIdentityMilestone?.title ?? 'Max identity reached';

  int get identityProgressPercent {
    final currentXpFloor = currentIdentityMilestone.requiredXp;
    final nextXp = nextIdentityMilestone?.requiredXp;
    if (nextXp == null) {
      return 100;
    }
    final range = (nextXp - currentXpFloor).clamp(1, 9999);
    return ((((xp - currentXpFloor) / range) * 100).round()).clamp(0, 100) as int;
  }

  Duration get prologueDuration {
    if (reduceMotion) return const Duration(milliseconds: 350);
    if (isAuthenticated && profileCompleted) return const Duration(milliseconds: 600);
    return const Duration(milliseconds: 1800);
  }

  void completePrologue() {
    prologueComplete = true;
    notifyListeners();
  }

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
    if (displayName.isEmpty) {
      displayName = currentUser!.fullName;
    }
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

  List<DailyTimeGridCell> get dailyTimeGridCells {
    final slots = List<DailyTimeGridCell>.generate(
      24,
      (index) => DailyTimeGridCell(index: index, activity: 'idle', completed: false),
    );

    final completedSlots = (worldState.progress / 4).floor().clamp(0, 24);
    for (var i = 0; i < completedSlots; i++) {
      slots[i] = DailyTimeGridCell(index: i, activity: 'work', completed: true);
    }

    for (var quest in quests.where((q) => q.status == 'complete')) {
      final pos = quest.id.hashCode.abs() % 24;
      slots[pos] = DailyTimeGridCell(
        index: pos,
        activity: quest.lifeArea,
        completed: true,
      );
    }

    for (var i = 0; i < 24; i++) {
      if (slots[i].completed) continue;
      final activity = (i % 4 == 0)
          ? 'rest'
          : (i % 3 == 0)
              ? 'exercise'
              : 'social';
      slots[i] = DailyTimeGridCell(index: i, activity: activity, completed: false);
    }

    return slots;
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
      QuestItem(
        id: DateTime.now().toIso8601String(),
        title: cleanTitle,
        lifeArea: lifeArea,
        progress: 0,
      ),
    );
    notifyListeners();
  }

  void awardXp(int amount) {
    xp += amount;
    _reconcileIdentity();
  }

  void activateCompletionAnimation({
    String? questId,
    String? sideQuestId,
    Duration duration = const Duration(milliseconds: 1600),
  }) {
    if (_completionAnimationTimer?.isActive ?? false) {
      _completionAnimationTimer?.cancel();
    }

    if (questId != null) {
      recentlyCompletedQuestId = questId;
    }
    if (sideQuestId != null) {
      recentlyClaimedSideQuestId = sideQuestId;
    }

    final effectiveDuration = reduceMotion
        ? const Duration(milliseconds: 300)
        : duration;

    _completionAnimationTimer = Timer(effectiveDuration, () {
      if (questId != null && recentlyCompletedQuestId == questId) {
        recentlyCompletedQuestId = null;
      }
      if (sideQuestId != null && recentlyClaimedSideQuestId == sideQuestId) {
        recentlyClaimedSideQuestId = null;
      }
      notifyListeners();
    });

    notifyListeners();
  }

  Future<void> completeQuest(QuestItem quest, {http.Client? client}) async {
    quest.status = 'in-progress';
    quest.syncStatus = 'pending';
    quest.progress = 100;
    questSyncState = 'pending';
    notifyListeners();

    final http.Client httpClient = client ?? http.Client();
    try {
      final response = await httpClient.post(
        Uri.parse('$_apiBaseUrl/game-profile/demo-user/quests/${Uri.encodeComponent(quest.id)}/complete'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({}),
      );
        if (response.statusCode == 200) {
          final payload = jsonDecode(response.body) as Map<String, dynamic>;
        final questPayload = payload['quest'] as Map<String, dynamic>?;
        quest.status = questPayload?['status'] as String? ?? 'complete';
        quest.progress = questPayload?['progress'] as int? ?? 100;
        quest.syncStatus = 'confirmed';
        questSyncState = 'confirmed';

        final profilePayload = payload['profile'] as Map<String, dynamic>?;
        if (profilePayload != null) {
          _mergeProfilePayload(profilePayload);
        } else {
          awardXp(20);
        }

        final worldStateResp = await httpClient.get(Uri.parse('$_apiBaseUrl/game-profile/demo-user/world-state'));
        if (worldStateResp.statusCode == 200) {
          final worldJson = jsonDecode(worldStateResp.body) as Map<String, dynamic>;
          worldState.seed = worldJson['seed'] as int? ?? worldState.seed;
          worldState.color = worldJson['color'] as String? ?? worldState.color;
          worldState.icon = worldJson['icon'] as String? ?? worldState.icon;
          worldState.progress = worldJson['progress'] as int? ?? worldState.progress;
        }

        if (quest.status == 'complete') {
          weeklyChallenge.progress = (weeklyChallenge.progress + 1).clamp(0, weeklyChallenge.target);
          if (weeklyChallenge.progress >= weeklyChallenge.target) {
            weeklyChallenge.status = 'complete';
            worldState.progress = (worldState.progress + 10).clamp(0, 100);
          }
        }

        activateCompletionAnimation(questId: quest.id);
      } else {
        quest.status = 'failed';
        quest.syncStatus = 'failed';
        questSyncState = 'failed';
        questSyncError = 'Complete quest failed status ${response.statusCode}';
      }
    } catch (err) {
      quest.status = 'failed';
      quest.syncStatus = 'failed';
      questSyncState = 'failed';
      questSyncError = err.toString();
    } finally {
      notifyListeners();
    }
  }

  Future<void> claimSideQuest(String id) async {
    final sideQuest = sideQuests.firstWhere((item) => item.id == id);
    sideQuest.completed = true;
    questSyncState = 'pending';
    worldState.progress = (worldState.progress + 8).clamp(0, 100); // optimistic local progress
    awardXp(sideQuest.rewardXp);
    notifyListeners();

    try {
      final client = http.Client();
      final response = await client.post(
        Uri.parse('$_apiBaseUrl/game-profile/demo-user/side-quests/${Uri.encodeComponent(id)}/claim'),
        headers: {'Content-Type': 'application/json'},
      );
      if (response.statusCode == 200) {
        questSyncState = 'confirmed';
        worldState.progress = (worldState.progress + 8).clamp(0, 100);
        activateCompletionAnimation(sideQuestId: sideQuest.id);
      } else {
        questSyncState = 'failed';
        questSyncError = 'Claim failed status ${response.statusCode}';
      }
    } catch (err) {
      questSyncState = 'failed';
      questSyncError = err.toString();
      // keep local completed state as optimistic and allow user retry
    } finally {
      notifyListeners();
    }
  }

  void saveProfile(LifeProfileFormValue value) {
    profile = value;
    profileCompleted = true;
    displayName = '${value.firstName} ${value.lastName}'.trim();
    notifyListeners();
  }

  void _mergeProfilePayload(Map<String, dynamic> payload) {
    avatar = payload['avatar'] as String? ?? avatar;
    themeName = payload['theme'] as String? ?? themeName;
    displayName = payload['displayName'] as String? ?? displayName;
    xp = payload['xp'] as int? ?? xp;
    level = payload['level'] as int? ?? level;
    streak = payload['streak'] as int? ?? streak;
    _reconcileIdentity();
  }

  void _reconcileIdentity({bool notify = true}) {
    xp = xp < 0 ? 0 : xp;
    final computedLevel = (xp ~/ 75) + 1;
    level = computedLevel < 1 ? 1 : (computedLevel > 99 ? 99 : computedLevel);

    final active = currentIdentityMilestone;
    if (!unlockedAvatars.contains(avatar)) {
      avatar = active.avatar;
    }
    if (!unlockedThemes.contains(themeName)) {
      themeName = active.theme;
    }

    if (notify) {
      notifyListeners();
    }
  }

  @override
  void dispose() {
    _completionAnimationTimer?.cancel();
    super.dispose();
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
          Container(
            margin: const EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.06),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: TextButton(
              onPressed: appState.toggleDarkMode,
              child: Text(appState.darkMode ? 'Light Mode' : 'Dark Mode'),
            ),
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
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.08),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    CircleAvatar(
                      radius: 18,
                      backgroundColor: Theme.of(
                        context,
                      ).colorScheme.primary.withValues(alpha: 0.2),
                      child: Text(appState.userInitials),
                    ),
                    const SizedBox(width: 8),
                    Text('Me', style: Theme.of(context).textTheme.labelLarge),
                  ],
                ),
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
        height: 76,
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
    final appState = HeroHourScope.of(context);

    return Scaffold(
      body: Stack(
        children: [
          const _AppBackdrop(),
          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                final wide = constraints.maxWidth >= 900;
                return SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
                  child: Center(
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1180),
                      child: wide
                          ? Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                const Expanded(child: _LoginHero()),
                                const SizedBox(width: 28),
                                Flexible(
                                  child: _LoginCard(
                                    emailController: _emailController,
                                    passwordController: _passwordController,
                                    error: _error,
                                    onSubmit: () {
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
                                  ),
                                ),
                              ],
                            )
                          : Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const _Eyebrow(label: 'Hero System'),
                                const SizedBox(height: 12),
                                Text(
                                  'Login',
                                  style: Theme.of(
                                    context,
                                  ).textTheme.headlineMedium,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Midnight Forge access for dashboard, profile, and quest management.',
                                  style: Theme.of(context).textTheme.bodyMedium,
                                ),
                                const SizedBox(height: 16),
                                _LoginCard(
                                  emailController: _emailController,
                                  passwordController: _passwordController,
                                  error: _error,
                                  showIntro: false,
                                  onSubmit: () {
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
                                ),
                              ],
                            ),
                    ),
                  ),
                );
              },
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

class _LoginHero extends StatelessWidget {
  const _LoginHero({this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Padding(
      padding: EdgeInsets.only(right: compact ? 0 : 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const _Eyebrow(label: 'Hero System'),
          const SizedBox(height: 18),
          Text(
            'Forge your next streak with a command surface worth returning to.',
            style: theme.textTheme.displayLarge?.copyWith(
              fontSize: compact ? 40 : 56,
            ),
          ),
          const SizedBox(height: 18),
          ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 520),
            child: Text(
              'HeroHour turns routines, projects, and recovery into one mobile quest board. Track the world state, close fast wins, and keep momentum visible.',
              style: theme.textTheme.bodyLarge?.copyWith(
                color: _bodyText.withValues(alpha: 0.92),
                height: 1.7,
              ),
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: const [
              _StatTile(value: '4', label: 'Realm tracks'),
              _StatTile(value: '24/7', label: 'Command view'),
              _StatTile(value: '+XP', label: 'Quick wins'),
            ],
          ),
        ],
      ),
    );
  }
}

class _LoginCard extends StatelessWidget {
  const _LoginCard({
    required this.emailController,
    required this.passwordController,
    required this.error,
    required this.onSubmit,
    this.showIntro = true,
  });

  final TextEditingController emailController;
  final TextEditingController passwordController;
  final String? error;
  final VoidCallback onSubmit;
  final bool showIntro;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Card(
      child: Container(
        decoration: _cardDecoration(),
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (showIntro) ...[
              Text(
                'Return to command',
                style: theme.textTheme.labelSmall?.copyWith(color: _mutedText),
              ),
              const SizedBox(height: 10),
              Text('Login', style: theme.textTheme.headlineMedium),
              const SizedBox(height: 8),
              Text(
                'Midnight Forge access for dashboard, profile, and quest management.',
                style: theme.textTheme.bodyMedium,
              ),
              const SizedBox(height: 24),
            ],
            TextField(
              controller: emailController,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email',
                helperText: 'Use your corporate or personal login address.',
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(
                labelText: 'Password',
                helperText: 'Must be 8+ characters and include a number.',
              ),
            ),
            if (error != null) ...[
              const SizedBox(height: 12),
              _NoticeBanner(message: error!, tone: BadgeTone.error),
            ],
            const SizedBox(height: 20),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: onSubmit,
                child: const Text('Login'),
              ),
            ),
          ],
        ),
      ),
    );
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

  List<Map<String, Object>> computeStrategyDimensions(HeroHourAppState appState) {
    final completedQuests = appState.quests.where((q) => q.status == 'complete').length;
    final totalQuests = appState.quests.isEmpty ? 1 : appState.quests.length;
    final planningScore = ((completedQuests / totalQuests) * 100).round().clamp(0, 100);

    final areaCounts = <String, int>{'health': 0, 'career': 0, 'relationships': 0, 'fun': 0};
    for (var q in appState.quests) {
      if (areaCounts.containsKey(q.lifeArea)) {
        areaCounts[q.lifeArea] = areaCounts[q.lifeArea]! + 1;
      }
    }
    final average = appState.quests.isEmpty ? 0.0 : appState.quests.length / areaCounts.length;
    final variance = areaCounts.values.fold<double>(0.0, (sum, v) => sum + ((v - average) / (average == 0 ? 1 : average)).abs());
    final balanceScore = (100 - (variance * 12)).round().clamp(0, 100);

    final recoveryScore = appState.sideQuests.isEmpty
        ? 50
        : ((appState.sideQuests.where((s) => s.completed).length / appState.sideQuests.length) * 100).round();
    final focusScore = appState.worldState.progress.clamp(0, 100);

    return [
      {'name': 'Planning consistency', 'score': planningScore, 'detail': '$completedQuests/$totalQuests quests complete'},
      {'name': 'Life-area balance', 'score': balanceScore, 'detail': '${areaCounts['health']}/${areaCounts['career']}/${areaCounts['relationships']}/${areaCounts['fun']}'},
      {'name': 'Recovery quality', 'score': recoveryScore, 'detail': '${appState.sideQuests.where((s) => s.completed).length}/${appState.sideQuests.length} side quests'},
      {'name': 'Focus depth', 'score': focusScore, 'detail': 'World progress ${appState.worldState.progress}%'}
    ];
  }

  List<Map<String, String>> computeStrategyRecommendations(HeroHourAppState appState) {
    final dims = computeStrategyDimensions(appState);
    final planning = dims[0]['score'] as int;
    final balance = dims[1]['score'] as int;
    final focus = dims[3]['score'] as int;

    final recs = <Map<String, String>>[];
    if (planning < 60) {
      recs.add({
        'text': 'Set 1-2 priority quests to improve planning consistency.',
        'rationale': 'Less than 60% completion suggests planning ramp-up needed.',
        'type': 'completion',
      });
    }
    if (balance < 70) {
      recs.add({
        'text': 'Add one quest in a less used life area for better balance.',
        'rationale': 'Low balance score indicates focus spill into one category.',
        'type': 'balance',
      });
    }
    if (focus > 70) {
      recs.add({
        'text': 'Keep momentum: execute a small task now and maintain progress.',
        'rationale': 'High focus suggests momentum leverage.',
        'type': 'momentum',
      });
    }
    if (recs.isEmpty) {
      recs.add({
        'text': 'Your strategy is stable—maintain your current progress path.',
        'rationale': 'No critical gaps detected.',
        'type': 'momentum',
      });
    }
    return recs;
  }

  String buildReentrySummary(HeroHourAppState appState) {
    final completed = appState.quests.where((q) => q.status == 'complete').length;
    return 'You completed $completed quests and your world is ${appState.worldState.progress}% progressed.';
  }

  @override
  Widget build(BuildContext context) {
    final appState = HeroHourScope.of(context);
    final theme = Theme.of(context);
    final prefersReducedMotion = MediaQuery.of(context).disableAnimations;
    final celebrationScale = prefersReducedMotion ? 1.01 : 1.03;
    final completionAnimDuration = prefersReducedMotion ? const Duration(milliseconds: 150) : const Duration(milliseconds: 240);
    final worldProgressDuration = prefersReducedMotion ? const Duration(milliseconds: 150) : const Duration(milliseconds: 700);

    if (appState.reduceMotion != prefersReducedMotion) {
      appState.reduceMotion = prefersReducedMotion;
    }

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
      children: [
        _HeroPanel(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const _Eyebrow(label: 'Midnight Forge'),
                    const SizedBox(height: 12),
                    Text('Dashboard', style: theme.textTheme.headlineMedium),
                    const SizedBox(height: 8),
                    Text(
                      'One command surface for health, work, recovery, and short-form wins.',
                      style: theme.textTheme.bodyMedium,
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              TextButton(
                onPressed: widget.onOpenProfile,
                child: const Text('New Profile'),
              ),
            ],
          ),
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
                  Text(
                    'API status: ${appState.hasApiError ? 'Unknown' : appState.apiStatus}',
                  ),
                  const SizedBox(height: 4),
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
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Realm seed',
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: _mutedText,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              '${appState.worldState.seed}',
                              style: theme.textTheme.displaySmall,
                            ),
                          ],
                        ),
                      ),
                      _ForgeIcon(label: appState.worldState.icon),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TweenAnimationBuilder<double>(
                    tween: Tween<double>(
                      begin: 0.0,
                      end: appState.worldState.progress / 100,
                    ),
                    duration: worldProgressDuration,
                    builder: (context, value, child) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(999),
                            child: LinearProgressIndicator(
                              minHeight: 10,
                              value: value,
                              backgroundColor:
                                  Colors.white.withValues(alpha: 0.08),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text('Progress: ${(value * 100).round()}%'),
                        ],
                      );
                    },
                  ),
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
            Container(
              key: const ValueKey('identity-card'),
              child: _InfoCard(
                width: 360,
                title: 'Identity Progression',
                badge: _StatusBadge(
                  label: appState.currentIdentityMilestone.stage,
                  tone: BadgeTone.success,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 52,
                          height: 52,
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(16),
                            color: _gold.withValues(alpha: 0.12),
                            border: Border.all(color: _gold.withValues(alpha: 0.28)),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            appState.avatar.substring(0, 1).toUpperCase(),
                            style: theme.textTheme.titleLarge?.copyWith(
                              color: const Color(0xFFF6D77A),
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(appState.currentIdentityMilestone.title, style: theme.textTheme.titleMedium),
                              const SizedBox(height: 4),
                              Text(
                                '${appState.avatar} avatar • ${appState.themeName} theme',
                                style: theme.textTheme.bodySmall?.copyWith(color: _mutedText),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _StatTile(value: '${appState.xp}', label: 'XP'),
                        _StatTile(value: '${appState.level}', label: 'Level'),
                        _StatTile(value: '${appState.streak}', label: 'Streak'),
                      ],
                    ),
                    const SizedBox(height: 14),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(999),
                      child: LinearProgressIndicator(
                        minHeight: 10,
                        value: appState.identityProgressPercent / 100,
                        backgroundColor: Colors.white.withValues(alpha: 0.08),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '${appState.identityProgressPercent}% to ${appState.nextIdentityLabel}',
                      style: theme.textTheme.bodySmall,
                    ),
                    const SizedBox(height: 12),
                    Text('Unlocked avatars', style: theme.textTheme.titleSmall),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: appState.unlockedAvatars
                          .map((item) => _ProfilePill(label: item))
                          .toList(),
                    ),
                    const SizedBox(height: 10),
                    Text('Unlocked themes', style: theme.textTheme.titleSmall),
                    const SizedBox(height: 6),
                    Wrap(
                      spacing: 6,
                      runSpacing: 6,
                      children: appState.unlockedThemes
                          .map((item) => _ProfilePill(label: item))
                          .toList(),
                    ),
                  ],
                ),
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
          title: 'Daily Time Grid',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Visualize your day like a quest board. Completed world progress and quests fill the grid.',
                style: theme.textTheme.bodySmall,
              ),
              const SizedBox(height: 10),
              DailyTimeGrid(
                cells: appState.dailyTimeGridCells,
                reducedMotion: appState.reduceMotion,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          key: const ValueKey('strategy-profile-card'),
          child: _InfoCard(
            title: 'Strategy Profile',
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Re-entry summary: ${buildReentrySummary(appState)}', style: theme.textTheme.bodySmall),
                const SizedBox(height: 8),
                ...computeStrategyDimensions(appState).map((dim) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(child: Text('${dim['name']}', style: theme.textTheme.bodySmall)),
                        Text('${dim['score']}%', style: theme.textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700)),
                      ],
                    ),
                  );
                }),
                const SizedBox(height: 6),
                const Divider(),
                const SizedBox(height: 6),
                Text('Recommendations', style: theme.textTheme.titleMedium),
                const SizedBox(height: 6),
                ...computeStrategyRecommendations(appState).map((rec) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 6),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('• ${rec['text']}', style: theme.textTheme.bodySmall),
                        Text('  (${rec['rationale']})', style: theme.textTheme.bodySmall?.copyWith(color: _mutedText, fontSize: 11)),
                      ],
                    ),
                  );
                }),
              ],
            ),
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
                _NoticeBanner(message: _formError!, tone: BadgeTone.error),
              ],
              const SizedBox(height: 16),
              if (appState.quests.isEmpty)
                const _EmptyState(
                  title: 'No quests yet',
                  body:
                      'Start by adding your first quest for life progress tracking.',
                )
              else
                ...appState.quests
                    .map(
                      (quest) {
                        final isQuestAnimating =
                            appState.recentlyCompletedQuestId == quest.id;
                        return AnimatedScale(
                          scale: isQuestAnimating ? celebrationScale : 1.0,
                          duration: completionAnimDuration,
                          curve: Curves.easeOut,
                          child: Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.04),
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.08),
                              ),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        quest.title,
                                        style: theme.textTheme.titleMedium,
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        '${quest.lifeArea} • ${quest.status} • ${quest.progress}%',
                                        style: theme.textTheme.bodySmall,
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),
                                quest.status == 'complete'
                                    ? const _StatusBadge(
                                        label: 'Completed',
                                        tone: BadgeTone.success,
                                      )
                                    : FilledButton.tonal(
                                        onPressed: () =>
                                            appState.completeQuest(quest),
                                        child: const Text('Complete'),
                                      ),
                              ],
                            ),
                          ),
                        );
                      },
                    )
                    .toList(),
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
                        (sideQuest) {
                          final isSideAnimating =
                              appState.recentlyClaimedSideQuestId == sideQuest.id;
                          return AnimatedScale(
                            scale: isSideAnimating ? celebrationScale : 1.0,
                            duration: completionAnimDuration,
                            curve: Curves.easeOut,
                            child: Card(
                              margin: const EdgeInsets.only(bottom: 10),
                              child: Container(
                                decoration: _cardDecoration(),
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
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
                          );
                        },
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
        const _Eyebrow(label: 'Identity Loadout'),
        const SizedBox(height: 12),
        Text('Life Profile', style: theme.textTheme.headlineMedium),
        const SizedBox(height: 6),
        Text(
          'Shape how HeroHour frames your goals, role, and pacing across the dashboard experience.',
          style: theme.textTheme.bodyMedium,
        ),
        const SizedBox(height: 16),
        LayoutBuilder(
          builder: (context, constraints) {
            final wide = constraints.maxWidth >= 860;
            final aside = Card(
              child: Container(
                decoration: _cardDecoration(),
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Profile impact',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: _mutedText,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Build a clearer operating profile',
                      style: theme.textTheme.titleLarge,
                    ),
                    const SizedBox(height: 12),
                    const _ProfileBullet(
                      text:
                          'Personalize the dashboard with a stronger identity layer.',
                    ),
                    const _ProfileBullet(
                      text:
                          'Adjust role framing for team-oriented quests and prompts.',
                    ),
                    const _ProfileBullet(
                      text:
                          'Keep your saved profile synced for future sessions.',
                    ),
                  ],
                ),
              ),
            );
            final formCard = Card(
              child: Container(
                decoration: _cardDecoration(),
                padding: const EdgeInsets.all(20),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      TextFormField(
                        controller: _firstNameController,
                        decoration: const InputDecoration(
                          labelText: 'First name',
                        ),
                        validator: (value) =>
                            value == null || value.trim().isEmpty
                            ? 'Required'
                            : null,
                      ),
                      const SizedBox(height: 12),
                      TextFormField(
                        controller: _lastNameController,
                        decoration: const InputDecoration(
                          labelText: 'Last name',
                        ),
                        validator: (value) =>
                            value == null || value.trim().isEmpty
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
                          DropdownMenuItem(
                            value: 'leader',
                            child: Text('Leader'),
                          ),
                          DropdownMenuItem(
                            value: 'member',
                            child: Text('Member'),
                          ),
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
                        _NoticeBanner(
                          message: _statusMessage,
                          tone: _statusMessage.startsWith('Error:')
                              ? BadgeTone.error
                              : BadgeTone.success,
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            );

            if (wide) {
              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(flex: 4, child: aside),
                  const SizedBox(width: 16),
                  Expanded(flex: 7, child: formCard),
                ],
              );
            }

            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [aside, const SizedBox(height: 16), formCard],
            );
          },
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

    return Stack(
      children: [
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: darkMode
                  ? const [_ink, _night, _steel]
                  : const [
                      Color(0xFFF7F1E2),
                      Color(0xFFE6D4AB),
                      Color(0xFFF7F3EA),
                    ],
            ),
          ),
          child: const SizedBox.expand(),
        ),
        Positioned(
          top: -80,
          right: -50,
          child: _GlowOrb(size: 260, color: _gold.withValues(alpha: 0.14)),
        ),
        Positioned(
          bottom: 120,
          left: -70,
          child: _GlowOrb(size: 220, color: _teal.withValues(alpha: 0.12)),
        ),
        IgnorePointer(
          child: CustomPaint(
            size: Size.infinite,
            painter: _GridPainter(
              lineColor: Colors.white.withValues(alpha: darkMode ? 0.04 : 0.06),
            ),
          ),
        ),
      ],
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
                style: Theme.of(
                  context,
                ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
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
      child: Container(
        decoration: _cardDecoration(),
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
        color: _gold,
        borderRadius: BorderRadius.circular(999),
        boxShadow: [
          BoxShadow(
            color: _gold.withValues(alpha: 0.24),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
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
      showCheckmark: false,
      side: BorderSide(
        color: selected ? _gold : Colors.white.withValues(alpha: 0.14),
      ),
      selectedColor: _gold.withValues(alpha: 0.24),
      backgroundColor: Colors.white.withValues(alpha: 0.04),
      labelStyle: Theme.of(context).textTheme.bodyMedium?.copyWith(
        color: selected ? const Color(0xFF0F172A) : _bodyText,
        fontWeight: FontWeight.w700,
      ),
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
        gradient: LinearGradient(
          colors: [
            Colors.white.withValues(alpha: 0.06),
            Colors.white.withValues(alpha: 0.02),
          ],
        ),
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

class _Eyebrow extends StatelessWidget {
  const _Eyebrow({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: _gold.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: _gold.withValues(alpha: 0.24)),
      ),
      child: Text(
        label,
        style: Theme.of(
          context,
        ).textTheme.labelSmall?.copyWith(color: const Color(0xFFF6D77A)),
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  const _StatTile({required this.value, required this.label});

  final String value;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 148,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.04),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: const Color(0xFFF6D77A),
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 4),
          Text(label, style: Theme.of(context).textTheme.bodySmall),
        ],
      ),
    );
  }
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel({required this.child});

  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Container(
        decoration: _cardDecoration(accent: _gold.withValues(alpha: 0.18)),
        padding: const EdgeInsets.all(20),
        child: child,
      ),
    );
  }
}

class _ForgeIcon extends StatelessWidget {
  const _ForgeIcon({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 58,
      height: 58,
      decoration: BoxDecoration(
        color: _gold.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _gold.withValues(alpha: 0.28)),
      ),
      child: Center(
        child: Text(
          label == 'Forge' ? '⚒' : label.substring(0, 1),
          style: const TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}

class _ProfileBullet extends StatelessWidget {
  const _ProfileBullet({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 8,
            height: 8,
            margin: const EdgeInsets.only(top: 6),
            decoration: const BoxDecoration(
              color: _gold,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(text, style: Theme.of(context).textTheme.bodyMedium),
          ),
        ],
      ),
    );
  }
}

class _ProfilePill extends StatelessWidget {
  const _ProfilePill({required this.label});

  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: _gold.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: _gold.withValues(alpha: 0.24)),
      ),
      child: Text(
        label,
        style: Theme.of(context).textTheme.bodySmall?.copyWith(
          color: const Color(0xFFF6D77A),
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _NoticeBanner extends StatelessWidget {
  const _NoticeBanner({required this.message, required this.tone});

  final String message;
  final BadgeTone tone;

  @override
  Widget build(BuildContext context) {
    final colors = switch (tone) {
      BadgeTone.success => (
        _success.withValues(alpha: 0.18),
        const Color(0xFFBBF7D0),
      ),
      BadgeTone.warning => (
        _warning.withValues(alpha: 0.18),
        const Color(0xFFFDE68A),
      ),
      BadgeTone.error => (
        _danger.withValues(alpha: 0.18),
        const Color(0xFFFECACA),
      ),
    };
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: colors.$1,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.$2.withValues(alpha: 0.32)),
      ),
      child: Text(
        message,
        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
          color: colors.$2,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _GlowOrb extends StatelessWidget {
  const _GlowOrb({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          gradient: RadialGradient(
            colors: [color, color.withValues(alpha: 0.02), Colors.transparent],
          ),
        ),
      ),
    );
  }
}

class DailyTimeGridCell {
  DailyTimeGridCell({
    required this.index,
    required this.activity,
    required this.completed,
  });

  final int index;
  final String activity;
  final bool completed;
}

class DailyTimeGrid extends StatelessWidget {
  const DailyTimeGrid({super.key, required this.cells, this.reducedMotion = false});

  final List<DailyTimeGridCell> cells;
  final bool reducedMotion;

  @override
  Widget build(BuildContext context) {
    if (cells.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Center(
          child: Text('No grid entries yet. Log an activity or complete a quest.'),
        ),
      );
    }

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 6,
      crossAxisSpacing: 4,
      mainAxisSpacing: 4,
      childAspectRatio: 1,
      children: cells.map((cell) {
        final color = cell.completed
            ? Colors.green.shade400
            : cell.activity == 'rest'
                ? Colors.blue.shade200
                : cell.activity == 'exercise'
                    ? Colors.orange.shade200
                    : cell.activity == 'social'
                        ? Colors.purple.shade200
                        : Colors.grey.shade200;

        return AnimatedContainer(
          duration: reducedMotion ? const Duration(milliseconds: 120) : const Duration(milliseconds: 300),
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: cell.completed ? Colors.white : Colors.grey.shade300, width: 1.2),
            boxShadow: cell.completed
                ? [BoxShadow(color: Colors.green.shade600.withOpacity(0.2), blurRadius: 4, spreadRadius: 0)]
                : [],
          ),
          child: Center(
            child: Text(
              '${cell.index + 1}',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: cell.completed ? Colors.white : Colors.black87,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

class _GridPainter extends CustomPainter {
  const _GridPainter({required this.lineColor});

  final Color lineColor;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = lineColor
      ..strokeWidth = 1;
    const spacing = 64.0;

    for (double x = 0; x <= size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y <= size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _GridPainter oldDelegate) =>
      oldDelegate.lineColor != lineColor;
}

BoxDecoration _cardDecoration({Color? accent}) {
  return BoxDecoration(
    borderRadius: BorderRadius.circular(24),
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        accent ?? _cardTop.withValues(alpha: 0.92),
        _cardBottom.withValues(alpha: 0.96),
      ],
    ),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.28),
        blurRadius: 28,
        offset: const Offset(0, 18),
      ),
    ],
  );
}

class IdentityMilestone {
  const IdentityMilestone({
    required this.requiredXp,
    required this.stage,
    required this.title,
    required this.avatar,
    required this.theme,
  });

  final int requiredXp;
  final String stage;
  final String title;
  final String avatar;
  final String theme;
}

const List<IdentityMilestone> _identityMilestones = [
  IdentityMilestone(
    requiredXp: 0,
    stage: 'initiate',
    title: 'Forge Initiate',
    avatar: 'default',
    theme: 'default',
  ),
  IdentityMilestone(
    requiredXp: 40,
    stage: 'pathfinder',
    title: 'Quest Pathfinder',
    avatar: 'pathfinder',
    theme: 'ember',
  ),
  IdentityMilestone(
    requiredXp: 120,
    stage: 'captain',
    title: 'Tempo Captain',
    avatar: 'sentinel',
    theme: 'aurora',
  ),
  IdentityMilestone(
    requiredXp: 240,
    stage: 'legend',
    title: 'Clockwork Legend',
    avatar: 'legend',
    theme: 'midnight',
  ),
];

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

  int seed;
  String color;
  String icon;
  int progress;
}

class QuestSuggestion {
  const QuestSuggestion({required this.title, required this.lifeArea});

  final String title;
  final String lifeArea;
}

class QuestItem {
  QuestItem({
    required this.id,
    required this.title,
    required this.lifeArea,
    required this.progress,
    this.status = 'pending',
    this.syncStatus = 'confirmed',
  });

  final String id;
  final String title;
  final String lifeArea;
  int progress;
  String status;
  String syncStatus;
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

class WeeklyChallenge {
  WeeklyChallenge({
    required this.id,
    required this.title,
    required this.description,
    required this.target,
    this.progress = 0,
    this.status = 'active',
    this.rewardXp = 50,
  });

  final String id;
  final String title;
  final String description;
  final int target;
  int progress;
  String status;
  int rewardXp;
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
