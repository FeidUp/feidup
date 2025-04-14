import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/services.dart';

// Define a color palette class for better organization and consistency
class AppColors {
  // Brand logo colors
  static const Color logoRed = Color(0xFFED4040);        // Logo red - #ed4040
  static const Color logoOffWhite = Color(0xFFF6F2E8);   // Logo off-white - #f6f2e8
  
  // Primary brand colors
  static const Color primary = Color(0xFFED4040);        // Logo red as primary
  static const Color secondary = Color(0xFF2E4057);      // Deep navy - Complementary to red
  static const Color accent = Color(0xFFFF9B54);         // Warm orange - Complementary accent
  static const Color green = Color(0xFF43AA8B);          // Sustainability green
  
  // Interface colors
  static const Color background = Color(0xFFFAF7F2);     // Lighter off-white for better contrast
  static const Color surface = Colors.white;             // White - Surface color
  static const Color cardBackground = Colors.white;      // Card background
  static const Color textPrimary = Color(0xFF2E2E2E);    // Near black - Primary text
  static const Color textSecondary = Color(0xFF707070);  // Dark gray - Secondary text
  static const Color border = Color(0xFFE0E0E0);         // Light gray - Border color
  
  // Feedback colors
  static const Color success = Color(0xFF43AA8B);        // Green - Success actions
  static const Color error = Color(0xFFED4040);          // Logo red - Error states
  
  // UI Enhancement colors
  static const Color shadow = Color(0x1A000000);         // Consistent shadow color
  static const Color shimmer = Color(0xFFEEEEEE);        // Shimmer effect color for loading states
}

// Typography class to manage font styles throughout the app
class AppTypography {
  // Logo and primary brand font (KawaiiRT-MonaShine)
  static const TextStyle logoStyle = TextStyle(
    fontFamily: 'KawaiiRTShine',
    fontSize: 48,
    color: AppColors.logoRed,
  );
  
  // Headings (using KawaiiRTLoyola for variety while maintaining brand consistency)
  static const TextStyle heading1 = TextStyle(
    fontFamily: 'KawaiiRTLoyola',
    fontSize: 32,
    color: AppColors.textPrimary,
  );
  
  static const TextStyle heading2 = TextStyle(
    fontFamily: 'KawaiiRTLoyola',
    fontSize: 24,
    color: AppColors.textPrimary,
  );
  
  // Accent headings (using KawaiiRTShadow for variety on special elements)
  static const TextStyle accentHeading = TextStyle(
    fontFamily: 'KawaiiRTShadow',
    fontSize: 28,
    color: AppColors.primary,
  );
  
  // Body text (using Google Fonts for better readability)
  static TextStyle bodyLarge(BuildContext context) => GoogleFonts.nunito(
    fontSize: 18,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
  );
  
  static TextStyle bodyMedium(BuildContext context) => GoogleFonts.nunito(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    color: AppColors.textPrimary,
  );
  
  static TextStyle bodySmall(BuildContext context) => GoogleFonts.nunito(
    fontSize: 14,
    fontWeight: FontWeight.w400,
    color: AppColors.textSecondary,
  );
  
  // Button text
  static TextStyle buttonText(BuildContext context) => GoogleFonts.quicksand(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: Colors.white,
  );
}

void main() {
  runApp(const FeidUpApp());
}

class FeidUpApp extends StatelessWidget {
  const FeidUpApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FeidUp - Universal Payment & Rewards App',
      debugShowCheckedModeBanner: false,  // Remove debug banner
      theme: ThemeData(
        primaryColor: AppColors.primary,
        scaffoldBackgroundColor: AppColors.background,
        textTheme: GoogleFonts.nunitoTextTheme(
          Theme.of(context).textTheme.apply(
                bodyColor: AppColors.textPrimary,
                displayColor: AppColors.textPrimary,
              ),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: false,
          systemOverlayStyle: SystemUiOverlayStyle.light, // For status bar
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            backgroundColor: MaterialStateProperty.resolveWith<Color>((states) {
              if (states.contains(MaterialState.disabled)) {
                return AppColors.secondary.withOpacity(0.5);
              }
              return AppColors.secondary;
            }),
            foregroundColor: MaterialStateProperty.all(Colors.white),
            shape: MaterialStateProperty.all(
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            elevation: MaterialStateProperty.all(0),
            padding: MaterialStateProperty.all(
              const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            ),
            overlayColor: MaterialStateProperty.all(Colors.white.withOpacity(0.1)),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: ButtonStyle(
            foregroundColor: MaterialStateProperty.all(AppColors.secondary),
            side: MaterialStateProperty.all(
              BorderSide(color: AppColors.secondary),
            ),
            shape: MaterialStateProperty.all(
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            padding: MaterialStateProperty.all(
              const EdgeInsets.symmetric(vertical: 16, horizontal: 24),
            ),
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            foregroundColor: MaterialStateProperty.all(AppColors.primary),
            padding: MaterialStateProperty.all(
              const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            ),
            shape: MaterialStateProperty.all(
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white,
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide(color: AppColors.primary, width: 2),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: BorderSide.none,
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
          hintStyle: GoogleFonts.nunito(
            color: AppColors.textSecondary.withOpacity(0.7),
            fontSize: 16,
          ),
        ),
        cardTheme: CardTheme(
          color: AppColors.cardBackground,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: BorderSide(
              color: Colors.grey.withOpacity(0.1),
              width: 1,
            ),
          ),
          margin: const EdgeInsets.symmetric(vertical: 8),
          shadowColor: AppColors.shadow,
        ),
        dividerTheme: DividerThemeData(
          color: Colors.grey.withOpacity(0.15),
          thickness: 1,
          space: 1,
        ),
        colorScheme: ColorScheme(
          brightness: Brightness.light,
          primary: AppColors.primary,
          onPrimary: Colors.white,
          secondary: AppColors.secondary,
          onSecondary: Colors.white,
          error: AppColors.error,
          onError: Colors.white,
          background: AppColors.background,
          onBackground: AppColors.textPrimary,
          surface: AppColors.surface,
          onSurface: AppColors.textPrimary,
        ),
        snackBarTheme: SnackBarThemeData(
          backgroundColor: AppColors.secondary,
          contentTextStyle: GoogleFonts.nunito(
            color: Colors.white,
            fontSize: 14,
          ),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      home: const SplashScreen(),
      routes: {
        '/home': (context) => const HomeScreen(),
        '/rewards': (context) => const RewardsScreen(),
        '/partner-restaurants': (context) => const PartnerRestaurantsScreen(),
        '/sustainability': (context) => const SustainabilityScreen(),
        '/profile': (context) => const ProfileScreen(),
      },
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeInAnimation;
  late Animation<double> _scaleAnimation;
  
  @override
  void initState() {
    super.initState();
    
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    
    _fadeInAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Interval(0.0, 0.5, curve: Curves.easeIn),
      ),
    );
    
    _scaleAnimation = Tween<double>(begin: 0.8, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Interval(0.0, 0.5, curve: Curves.easeOutBack),
      ),
    );
    
    _animationController.forward();
    
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) => const HomeScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            var fadeTransition = FadeTransition(
              opacity: animation,
              child: child,
            );
            return fadeTransition;
          },
          transitionDuration: const Duration(milliseconds: 800),
        ),
      );
    });
  }
  
  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.primary,
              AppColors.secondary,
            ],
          ),
        ),
        child: Center(
          child: AnimatedBuilder(
            animation: _animationController,
            builder: (context, child) {
              return FadeTransition(
                opacity: _fadeInAnimation,
                child: Transform.scale(
                  scale: _scaleAnimation.value,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: AppColors.logoOffWhite,
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 20,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: Image.asset(
                          'assets/logos/company_logo.png',
                          height: 120,
                        ),
                      ),
                      const SizedBox(height: 30),
                      Text(
                        'FeidUp',
                        style: AppTypography.logoStyle.copyWith(
                          color: AppColors.logoOffWhite,
                          shadows: const [
                            Shadow(
                              color: Colors.black26,
                              blurRadius: 5,
                              offset: Offset(0, 2),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Universal Payment & Rewards',
                        style: GoogleFonts.quicksand(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                          color: Colors.white,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 50),
                      SizedBox(
                        width: 40,
                        height: 40,
                        child: CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(AppColors.logoOffWhite),
                          strokeWidth: 3,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  int _selectedIndex = 0;
  
  // Page controller for smooth transitions
  final PageController _pageController = PageController();
  
  // For animated selected icon
  late AnimationController _animationController;
  late Animation<double> _animation;
  
  static final List<Widget> _widgetOptions = <Widget>[
    const DashboardTab(),
    const RewardsTab(),
    const PartnerRestaurantsScreen(),
    const SustainabilityScreen(),
    const ProfileScreen(),
    const PaymentTab(),
  ];

  static const List<String> _screenTitles = [
    'Home',
    'Rewards',
    'Restaurants',
    'Sustainability',
    'Profile',
    'Payments',
  ];
  
  @override
  void initState() {
    super.initState();
    
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 300),
    );
    
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animationController, curve: Curves.easeInOut),
    );
    
    _animationController.forward();
  }
  
  @override
  void dispose() {
    _pageController.dispose();
    _animationController.dispose();
    super.dispose();
  }
  
  void _onItemTapped(int index) {
    if (_selectedIndex == index) return;
    
    // Reset and replay animation
    _animationController.reset();
    _animationController.forward();
    
    setState(() {
      _selectedIndex = index;
    });
    
    // Animate to the new page
    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.primary,
        elevation: 0,
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: AppColors.logoOffWhite,
                shape: BoxShape.circle,
              ),
              child: Image.asset(
                'assets/logos/company_logo.png',
                height: 32,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'FeidUp',
              style: AppTypography.logoStyle.copyWith(
                fontSize: 24, 
                color: Colors.white,
              ),
            ),
          ],
        ),
        actions: [
          _buildNotificationIcon(),
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () {
              Navigator.pushNamed(context, '/profile');
            },
            color: Colors.white,
          ),
        ],
      ),
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(), // Disable swiping
        children: _widgetOptions,
        onPageChanged: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
      floatingActionButton: _selectedIndex == 0 ? _buildScanQrFab() : null,
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(0, Icons.home_outlined, Icons.home, 'Home'),
              _buildNavItem(1, Icons.card_giftcard_outlined, Icons.card_giftcard, 'Rewards'),
              const SizedBox(width: 20), // Space for FAB
              _buildNavItem(3, Icons.eco_outlined, Icons.eco, 'Eco'),
              _buildNavItem(4, Icons.person_outline, Icons.person, 'Profile'),
              _buildNavItem(5, Icons.payment_outlined, Icons.payment, 'Payments'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, IconData activeIcon, String label) {
    final isSelected = _selectedIndex == index;
    
    return InkWell(
      onTap: () => _onItemTapped(index),
      borderRadius: BorderRadius.circular(16),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 300),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.1) : Colors.transparent,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSelected ? activeIcon : icon,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
              size: 24,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.quicksand(
                fontSize: 12,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScanQrFab() {
    return FloatingActionButton(
      onPressed: () {
        _showQrScannerModal(context);
      },
      backgroundColor: AppColors.primary,
      child: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return Transform.rotate(
            angle: _animation.value * 2.0 * 3.14159 * 0.25,
            child: const Icon(
              Icons.qr_code_scanner,
              color: Colors.white,
            ),
          );
        },
      ),
    );
  }
  
  Widget _buildNotificationIcon() {
    return Stack(
      clipBehavior: Clip.none,
      children: [
        IconButton(
          icon: const Icon(Icons.notifications_outlined),
          onPressed: () {
            // Show notifications panel
          },
          color: Colors.white,
        ),
        Positioned(
          top: 10,
          right: 12,
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: AppColors.accent,
              shape: BoxShape.circle,
              border: Border.all(
                color: AppColors.primary,
                width: 1.5,
              ),
            ),
            constraints: const BoxConstraints(
              minWidth: 8,
              minHeight: 8,
            ),
          ),
        ),
      ],
    );
  }
  
  void _showQrScannerModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        maxChildSize: 0.9,
        minChildSize: 0.5,
        builder: (context, scrollController) {
          return Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: Column(
              children: [
                // Sheet handle for better UX
                Container(
                  margin: const EdgeInsets.only(top: 12),
                  height: 4,
                  width: 40,
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.5),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  'Scan QR Code',
                  style: AppTypography.heading2,
                ),
                const SizedBox(height: 24),
                Expanded(
                  child: Container(
                    margin: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Center(
                      child: Icon(
                        Icons.qr_code_scanner,
                        size: 150,
                        color: AppColors.textSecondary,
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(24.0),
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                    ),
                    child: Container(
                      width: double.infinity,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      child: Text(
                        'Cancel',
                        style: AppTypography.buttonText(context),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class DashboardTab extends StatefulWidget {
  const DashboardTab({super.key});

  @override
  State<DashboardTab> createState() => _DashboardTabState();
}

class _DashboardTabState extends State<DashboardTab> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final ScrollController _scrollController = ScrollController();
  bool _showShadow = false;
  
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _scrollController.addListener(_scrollListener);
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    _scrollController.removeListener(_scrollListener);
    _scrollController.dispose();
    super.dispose();
  }
  
  void _scrollListener() {
    if (_scrollController.offset > 0 && !_showShadow) {
      setState(() {
        _showShadow = true;
      });
    } else if (_scrollController.offset <= 0 && _showShadow) {
      setState(() {
        _showShadow = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.background,
        image: DecorationImage(
          image: const AssetImage('assets/logos/company_logo.png'),
          opacity: 0.03,
          fit: BoxFit.cover,
        ),
      ),
      child: NestedScrollView(
        controller: _scrollController,
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
                child: _buildGreeting(context),
              ),
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: _buildRewardsOverview(context),
              ),
            ),
            SliverToBoxAdapter(
              child: _buildQuickActions(context),
            ),
            SliverPersistentHeader(
              pinned: true,
              delegate: _SliverAppBarDelegate(
                minHeight: 50,
                maxHeight: 50,
                child: Container(
                  decoration: BoxDecoration(
                    color: AppColors.background,
                    boxShadow: _showShadow
                        ? [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.05),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ]
                        : null,
                  ),
                  child: TabBar(
                    controller: _tabController,
                    labelColor: AppColors.primary,
                    unselectedLabelColor: AppColors.textSecondary,
                    indicatorColor: AppColors.primary,
                    indicatorWeight: 3,
                    indicatorSize: TabBarIndicatorSize.label,
                    labelStyle: GoogleFonts.quicksand(
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                    unselectedLabelStyle: GoogleFonts.quicksand(
                      fontWeight: FontWeight.normal,
                      fontSize: 14,
                    ),
                    tabs: const [
                      Tab(text: 'Featured'),
                      Tab(text: 'Nearby'),
                      Tab(text: 'Promotions'),
                    ],
                  ),
                ),
              ),
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            _buildFeaturedTab(context),
            _buildNearbyTab(context),
            _buildPromotionsTab(context),
          ],
        ),
      ),
    );
  }

  Widget _buildGreeting(BuildContext context) {
    // Get current time to personalize greeting
    final hour = DateTime.now().hour;
    String greeting;
    
    if (hour < 12) {
      greeting = 'Good Morning';
    } else if (hour < 17) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
    
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              greeting,
              style: AppTypography.bodyLarge(context),
            ),
            const SizedBox(height: 4),
            Text(
              'Jane Doe',
              style: AppTypography.heading2.copyWith(
                color: AppColors.primary,
              ),
            ),
          ],
        ),
        Hero(
          tag: 'profile_avatar',
          child: GestureDetector(
            onTap: () {
              Navigator.pushNamed(context, '/profile');
            },
            child: Container(
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(
                  color: AppColors.primary,
                  width: 2,
                ),
              ),
              child: const CircleAvatar(
                radius: 22,
                backgroundColor: AppColors.background,
                child: Icon(
                  Icons.person,
                  color: AppColors.primary,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildRewardsOverview(BuildContext context) {
    return Card(
      elevation: 2,
      shadowColor: AppColors.shadow,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.primary,
              AppColors.primary.withOpacity(0.9),
              AppColors.secondary,
            ],
            stops: const [0.0, 0.6, 1.0],
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Your Points',
                        style: AppTypography.bodyMedium(context).copyWith(
                          color: Colors.white.withOpacity(0.9),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '2,450',
                            style: AppTypography.heading1.copyWith(
                              color: Colors.white,
                              height: 1,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            margin: const EdgeInsets.only(top: 8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Row(
                              children: [
                                const Icon(
                                  Icons.arrow_upward,
                                  color: Colors.white,
                                  size: 14,
                                ),
                                Text(
                                  '250 this week',
                                  style: AppTypography.bodySmall(context).copyWith(
                                    color: Colors.white,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  TweenAnimationBuilder<double>(
                    tween: Tween<double>(begin: 0.0, end: 0.7),
                    duration: const Duration(seconds: 1),
                    curve: Curves.easeOutCubic,
                    builder: (context, value, child) {
                      return Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            height: 60,
                            width: 60,
                            child: CircularProgressIndicator(
                              value: value,
                              strokeWidth: 6,
                              backgroundColor: Colors.white.withOpacity(0.2),
                              valueColor: const AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          ),
                          Icon(
                            Icons.star_rounded,
                            color: Colors.white,
                            size: 32,
                          ),
                        ],
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TweenAnimationBuilder<double>(
                tween: Tween<double>(begin: 0.0, end: 0.7),
                duration: const Duration(seconds: 1),
                curve: Curves.easeOutCubic,
                builder: (context, value, child) {
                  return Column(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: LinearProgressIndicator(
                          value: value,
                          backgroundColor: Colors.white.withOpacity(0.2),
                          color: Colors.white,
                          minHeight: 10,
                        ),
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 8),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '550 points to next reward',
                    style: AppTypography.bodySmall(context).copyWith(
                      color: Colors.white.withOpacity(0.9),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    '3000 points',
                    style: AppTypography.bodySmall(context).copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      onPressed: () {
                        Navigator.pushNamed(context, '/rewards');
                      },
                      icon: const Icon(Icons.redeem),
                      label: Text('Redeem Now', style: AppTypography.buttonText(context)),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: AppColors.primary,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 12),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActions(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      child: Container(
        height: 110,
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(16),
        ),
        child: ListView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          children: [
            _buildActionButton(
              context,
              Icons.qr_code_scanner,
              'Scan QR',
              AppColors.primary,
              () {},
            ),
            _buildActionButton(
              context,
              Icons.redeem,
              'Redeem',
              AppColors.secondary,
              () {},
            ),
            _buildActionButton(
              context,
              Icons.store_outlined,
              'Find Store',
              AppColors.accent,
              () {},
            ),
            _buildActionButton(
              context,
              Icons.history,
              'History',
              AppColors.green,
              () {},
            ),
            _buildActionButton(
              context,
              Icons.card_giftcard,
              'Gift Card',
              AppColors.primary,
              () {},
            ),
            _buildActionButton(
              context,
              Icons.local_offer_outlined,
              'Offers',
              AppColors.secondary,
              () {},
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionButton(
    BuildContext context,
    IconData icon,
    String label,
    Color color,
    VoidCallback onPressed,
  ) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onPressed,
              borderRadius: BorderRadius.circular(16),
              child: Ink(
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Container(
                  width: 80,
                  height: 60,
                  alignment: Alignment.center,
                  child: Icon(
                    icon,
                    color: color,
                    size: 28,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: AppTypography.bodySmall(context).copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedTab(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildFeaturedRestaurants(context),
            _buildPromotions(context, isFeatured: true),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildNearbyTab(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: 5, // Sample data
      itemBuilder: (context, index) {
        return _buildNearbyRestaurantCard(
          context,
          index,
          [
            'Mama\'s Kitchen',
            'Golden Dragon',
            'Taco Corner',
            'The Grill House',
            'Sushi Express',
          ][index],
          [
            'Italian • 4.8 ★',
            'Chinese • 4.6 ★',
            'Mexican • 4.7 ★',
            'BBQ • 4.9 ★',
            'Japanese • 4.7 ★',
          ][index],
          [
            '0.5 miles away',
            '0.8 miles away',
            '1.2 miles away',
            '1.5 miles away',
            '1.7 miles away',
          ][index],
          [
            '2.5x points today!',
            'Eco-friendly packaging',
            '10% cashback',
            'New partnership!',
            '15% off first order',
          ][index],
        );
      },
    );
  }

  Widget _buildPromotionsTab(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildPromotionCard(
          context,
          'Eco-Friendly Packaging Initiative',
          'Support restaurants using sustainable packaging with 3x reward points this week!',
          'Sustainability',
          Icons.eco_outlined,
          AppColors.green,
        ),
        _buildPromotionCard(
          context,
          'Refer a Friend',
          'Get 500 bonus points when your friend makes their first order',
          'Limited Time',
          Icons.people_outline,
          AppColors.primary,
        ),
        _buildPromotionCard(
          context,
          'Double Points Weekends',
          'Earn 2x points on all transactions during weekends',
          'Every Weekend',
          Icons.event_note,
          AppColors.accent,
        ),
        _buildPromotionCard(
          context,
          'Local Business Support',
          'Special rewards for supporting family-owned restaurants',
          'Community',
          Icons.store_outlined,
          AppColors.secondary,
        ),
      ],
    );
  }

  Widget _buildNearbyRestaurantCard(
    BuildContext context,
    int index,
    String name,
    String category,
    String distance,
    String promotion,
  ) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 0,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
                child: Container(
                  height: 130,
                  width: double.infinity,
                  color: AppColors.secondary.withOpacity(0.1),
                  child: Center(
                    child: Icon(
                      Icons.restaurant,
                      size: 48,
                      color: AppColors.secondary.withOpacity(0.6),
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 12,
                right: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 14,
                        color: AppColors.primary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        distance,
                        style: AppTypography.bodySmall(context).copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            style: AppTypography.heading2.copyWith(
                              fontSize: 18,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            category,
                            style: AppTypography.bodySmall(context),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.primary.withOpacity(0.1),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.favorite_border,
                        color: AppColors.primary,
                        size: 20,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: AppColors.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    promotion,
                    style: AppTypography.bodySmall(context).copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.qr_code_scanner, size: 18),
                        label: Text('Pay Now', style: AppTypography.buttonText(context).copyWith(fontSize: 14)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.secondary.withOpacity(0.1),
                        foregroundColor: AppColors.secondary,
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Icon(Icons.arrow_forward),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedRestaurants(BuildContext context) {
    // Calculate how many restaurants to show based on screen width
    final screenWidth = MediaQuery.of(context).size.width;
    final cardWidth = screenWidth < 600 ? 160.0 : 200.0; // Smaller cards on small screens
    
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Featured Restaurants',
                style: AppTypography.heading2.copyWith(fontSize: 18),
              ),
              TextButton.icon(
                onPressed: () {
                  Navigator.pushNamed(context, '/partner-restaurants');
                },
                icon: const Icon(Icons.arrow_forward, size: 16),
                label: Text(
                  'See All',
                  style: AppTypography.bodySmall(context).copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          SizedBox(
            height: 220, // Increased height to fit content better
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: 6,
              itemBuilder: (context, index) {
                final restaurants = [
                  {
                    'name': 'Mama\'s Kitchen',
                    'category': 'Italian • 4.8 ★',
                    'promotion': '2.5x points today!',
                  },
                  {
                    'name': 'Golden Dragon',
                    'category': 'Chinese • 4.6 ★',
                    'promotion': 'Eco-friendly',
                  },
                  {
                    'name': 'Taco Corner',
                    'category': 'Mexican • 4.7 ★',
                    'promotion': '10% cashback',
                  },
                  {
                    'name': 'The Grill House',
                    'category': 'BBQ • 4.9 ★',
                    'promotion': 'New partner!',
                  },
                  {
                    'name': 'Sushi Express',
                    'category': 'Japanese • 4.7 ★',
                    'promotion': '15% off first order',
                  },
                  {
                    'name': 'Pizza Palace',
                    'category': 'Italian • 4.5 ★',
                    'promotion': 'Free delivery',
                  },
                ];
                
                final restaurant = restaurants[index % restaurants.length];
                return _buildRestaurantCard(
                  context,
                  restaurant['name']!,
                  restaurant['category']!,
                  restaurant['promotion']!,
                  cardWidth,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRestaurantCard(
      BuildContext context, String name, String category, String promotion, double width) {
    return Container(
      width: width,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
                child: Container(
                  height: 110,
                  width: double.infinity,
                  color: AppColors.secondary.withOpacity(0.1),
                  child: Center(
                    child: Icon(
                      Icons.restaurant,
                      size: 40,
                      color: AppColors.secondary.withOpacity(0.6),
                    ),
                  ),
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    Icons.favorite_border,
                    color: AppColors.primary,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: AppTypography.bodyMedium(context).copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    category,
                    style: AppTypography.bodySmall(context),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      promotion,
                      style: AppTypography.bodySmall(context).copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPromotions(BuildContext context, {bool isFeatured = false}) {
    if (isFeatured) {
      return Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Current Promotions',
                  style: AppTypography.heading2.copyWith(fontSize: 18),
                ),
                TextButton.icon(
                  onPressed: () {
                    _tabController.animateTo(2);
                  },
                  icon: const Icon(Icons.arrow_forward, size: 16),
                  label: Text(
                    'See All',
                    style: AppTypography.bodySmall(context).copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildPromotionCard(
              context,
              'Eco-Friendly Packaging Initiative',
              'Support restaurants using sustainable packaging with 3x reward points this week!',
              'Sustainability',
              Icons.eco_outlined,
              AppColors.green,
            ),
          ],
        ),
      );
    } else {
      return Container(); // Empty if not featured tab
    }
  }

  Widget _buildPromotionCard(
    BuildContext context,
    String title,
    String description,
    String badge,
    IconData icon,
    Color color,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            color,
            color.withOpacity(0.7),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Text(
                        badge,
                        style: AppTypography.bodySmall(context).copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      title,
                      style: AppTypography.heading2.copyWith(
                        color: Colors.white,
                        fontSize: 20,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      description,
                      style: AppTypography.bodyMedium(context).copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 20),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  color: Colors.white,
                  size: 32,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: color,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Learn More',
                        style: AppTypography.buttonText(context).copyWith(
                          color: color,
                        ),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.arrow_forward),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverAppBarDelegate({
    required this.minHeight,
    required this.maxHeight,
    required this.child,
  });

  final double minHeight;
  final double maxHeight;
  final Widget child;

  @override
  double get minExtent => minHeight;

  @override
  double get maxExtent => maxHeight;

  @override
  Widget build(BuildContext context, double shrinkOffset, bool overlapsContent) {
    return SizedBox.expand(child: child);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return maxHeight != oldDelegate.maxHeight ||
        minHeight != oldDelegate.minHeight ||
        child != oldDelegate.child;
  }
}

class RewardsScreen extends StatelessWidget {
  const RewardsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your Rewards',
              style: AppTypography.heading1,
            ),
            const SizedBox(height: 16),
            _buildRewardsCard(context),
            const SizedBox(height: 24),
            Text(
              'Available Rewards',
              style: AppTypography.heading2,
            ),
            const SizedBox(height: 16),
            _buildRewardItem(
              context, 
              'Free Dessert', 
              '500 points',
              Icons.icecream,
              AppColors.secondary,
            ),
            _buildRewardItem(
              context, 
              '10% Off Next Order', 
              '1000 points',
              Icons.local_offer,
              AppColors.primary,
            ),
            _buildRewardItem(
              context, 
              'Free Delivery', 
              '1500 points',
              Icons.delivery_dining,
              AppColors.accent,
            ),
            _buildRewardItem(
              context, 
              '\$10 Cashback', 
              '15000 points',
              Icons.account_balance_wallet,
              AppColors.green,
            ),
            const SizedBox(height: 24),
            Text(
              'Reward History',
              style: AppTypography.heading2,
            ),
            const SizedBox(height: 16),
            _buildHistoryItem(
              context,
              'Free Dessert Redeemed',
              'at Golden Dragon',
              '03 Apr 2025',
              Icons.check_circle,
              AppColors.green,
            ),
            _buildHistoryItem(
              context,
              '10% Off Applied',
              'at Mama\'s Kitchen',
              '28 Mar 2025',
              Icons.check_circle,
              AppColors.green,
            ),
            _buildHistoryItem(
              context,
              'Free Delivery',
              'at The Grill House',
              '15 Mar 2025',
              Icons.check_circle,
              AppColors.green,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRewardsCard(BuildContext context) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              AppColors.primary,
              AppColors.secondary,
            ],
          ),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Current Balance',
                      style: AppTypography.bodyMedium(context).copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '2,450',
                      style: AppTypography.heading1.copyWith(
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'reward points',
                      style: AppTypography.bodyMedium(context).copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.stars_rounded,
                    color: Colors.white,
                    size: 48,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              'Next Reward: \$10 Cashback at 15000 points',
              style: AppTypography.bodyMedium(context).copyWith(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: LinearProgressIndicator(
                value: 0.7,
                backgroundColor: Colors.white.withOpacity(0.2),
                color: Colors.white,
                minHeight: 10,
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '550 points to go',
                  style: AppTypography.bodySmall(context).copyWith(
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
                Text(
                  '2450/3000',
                  style: AppTypography.bodySmall(context).copyWith(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildRewardCardButton(
                  context,
                  'Redeem',
                  Icons.redeem,
                ),
                _buildRewardCardButton(
                  context,
                  'Earn More',
                  Icons.add_circle_outline,
                ),
                _buildRewardCardButton(
                  context,
                  'Share',
                  Icons.share,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRewardCardButton(BuildContext context, String label, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.2),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: Colors.white,
            size: 18,
          ),
          const SizedBox(width: 6),
          Text(
            label,
            style: AppTypography.bodySmall(context).copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRewardItem(
      BuildContext context, String title, String points, IconData icon, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: color,
          ),
        ),
        title: Text(
          title,
          style: AppTypography.bodyMedium(context).copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          'Redeem for $points',
          style: AppTypography.bodySmall(context),
        ),
        trailing: ElevatedButton(
          onPressed: () {},
          style: ElevatedButton.styleFrom(
            backgroundColor: color,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          ),
          child: Text(
            'Redeem',
            style: AppTypography.bodySmall(context).copyWith(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHistoryItem(
      BuildContext context, String title, String subtitle, String date, IconData icon, Color color) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
          ),
          child: Icon(
            icon,
            color: color,
          ),
        ),
        title: Text(
          title,
          style: AppTypography.bodyMedium(context).copyWith(
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          '$subtitle • $date',
          style: AppTypography.bodySmall(context),
        ),
      ),
    );
  }
}

class PartnerRestaurantsScreen extends StatelessWidget {
  const PartnerRestaurantsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Partner Restaurants',
              style: AppTypography.heading1,
            ),
            const SizedBox(height: 8),
            Text(
              'Support local family-owned restaurants',
              style: AppTypography.bodyMedium(context).copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 16),
            TextFormField(
              decoration: InputDecoration(
                hintText: 'Search restaurants',
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(
                    color: AppColors.primary.withOpacity(0.5),
                    width: 2,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip(context, 'All', true),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'Near Me', false),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'Most Points', false),
                  const SizedBox(width: 8),
                  _buildFilterChip(context, 'Eco-Friendly', false),
                ],
              ),
            ),
            const SizedBox(height: 20),
            // Dynamic responsive grid of restaurants
            _buildResponsiveRestaurantGrid(context),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(BuildContext context, String label, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary : Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isSelected ? AppColors.primary : AppColors.textSecondary.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Text(
        label,
        style: AppTypography.bodySmall(context).copyWith(
          color: isSelected ? Colors.white : AppColors.textSecondary,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildResponsiveRestaurantGrid(BuildContext context) {
    // Sample restaurant data
    final restaurants = [
      {
        'name': 'Mama\'s Kitchen',
        'category': 'Italian • 4.8 ★',
        'distance': '2.5 miles away',
        'promotion': '2.5x points today!',
        'color': AppColors.primary,
      },
      {
        'name': 'Golden Dragon',
        'category': 'Chinese • 4.6 ★',
        'distance': '1.2 miles away',
        'promotion': 'Eco-friendly packaging',
        'color': AppColors.green,
      },
      {
        'name': 'Taco Corner',
        'category': 'Mexican • 4.7 ★',
        'distance': '3.0 miles away',
        'promotion': '10% cashback',
        'color': AppColors.accent,
      },
      {
        'name': 'The Grill House',
        'category': 'BBQ • 4.9 ★',
        'distance': '0.8 miles away',
        'promotion': 'New partnership!',
        'color': AppColors.secondary,
      },
      {
        'name': 'Sunny Side Up',
        'category': 'Breakfast • 4.5 ★',
        'distance': '1.5 miles away',
        'promotion': '1.5x points',
        'color': AppColors.primary,
      },
      {
        'name': 'Pasta Paradise',
        'category': 'Italian • 4.3 ★',
        'distance': '2.1 miles away',
        'promotion': 'Family owned since 1985',
        'color': AppColors.secondary,
      },
    ];

    return LayoutBuilder(
      builder: (context, constraints) {
        // Calculate number of columns based on screen width
        final screenWidth = constraints.maxWidth;
        int crossAxisCount;
        double cardWidth;
        
        // Responsive grid sizing
        if (screenWidth > 1200) {
          crossAxisCount = 3; // 3 columns for large screens
          cardWidth = screenWidth / 3 - 24;
        } else if (screenWidth > 800) {
          crossAxisCount = 2; // 2 columns for medium screens
          cardWidth = screenWidth / 2 - 24;
        } else {
          crossAxisCount = 1; // 1 column for small screens
          cardWidth = screenWidth - 16;
        }

        // For smaller screens, use ListView instead of GridView
        if (crossAxisCount == 1) {
          return ListView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            itemCount: restaurants.length,
            itemBuilder: (context, index) {
              final restaurant = restaurants[index];
              return _buildRestaurantListItem(
                context,
                restaurant['name'] as String,
                restaurant['category'] as String,
                restaurant['distance'] as String,
                restaurant['promotion'] as String,
                restaurant['color'] as Color,
              );
            },
          );
        } else {
          // For medium and large screens, use GridView
          return GridView.builder(
            physics: const NeverScrollableScrollPhysics(),
            shrinkWrap: true,
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: crossAxisCount,
              childAspectRatio: cardWidth / 350, // Adjust card height
              crossAxisSpacing: 16,
              mainAxisSpacing: 16,
            ),
            itemCount: restaurants.length,
            itemBuilder: (context, index) {
              final restaurant = restaurants[index];
              return _buildRestaurantGridItem(
                context,
                restaurant['name'] as String,
                restaurant['category'] as String,
                restaurant['distance'] as String,
                restaurant['promotion'] as String,
                restaurant['color'] as Color,
              );
            },
          );
        }
      },
    );
  }

  Widget _buildRestaurantGridItem(
      BuildContext context, String name, String category, String distance, String promotion, Color promotionColor) {
    return Card(
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(16),
              topRight: Radius.circular(16),
            ),
            child: Container(
              height: 120,
              width: double.infinity,
              color: AppColors.secondary.withOpacity(0.1),
              child: Center(
                child: Icon(
                  Icons.restaurant,
                  size: 48,
                  color: AppColors.secondary.withOpacity(0.6),
                ),
              ),
            ),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              name,
                              style: AppTypography.heading2.copyWith(
                                fontSize: 20,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              category,
                              style: AppTypography.bodyMedium(context),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.background,
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          Icons.favorite_border,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        size: 16,
                        color: AppColors.textSecondary,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        distance,
                        style: AppTypography.bodySmall(context),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: promotionColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            promotion,
                            style: AppTypography.bodySmall(context).copyWith(
                              color: promotionColor,
                              fontWeight: FontWeight.bold,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            textAlign: TextAlign.center,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.qr_code_scanner),
                          label: Text('Scan QR', style: AppTypography.buttonText(context)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.restaurant_menu),
                          label: Text('Menu', style: AppTypography.buttonText(context)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.secondary,
                            padding: const EdgeInsets.symmetric(vertical: 12),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRestaurantListItem(
      BuildContext context, String name, String category, String distance, String promotion, Color promotionColor) {
    // Keep list item layout for mobile screens
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ClipRRect(
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(16),
              topRight: Radius.circular(16),
            ),
            child: Container(
              height: 120,
              width: double.infinity,
              color: AppColors.secondary.withOpacity(0.1),
              child: Center(
                child: Icon(
                  Icons.restaurant,
                  size: 48,
                  color: AppColors.secondary.withOpacity(0.6),
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            name,
                            style: AppTypography.heading2.copyWith(
                              fontSize: 20,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            category,
                            style: AppTypography.bodyMedium(context),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppColors.background,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.favorite_border,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Icon(
                      Icons.location_on,
                      size: 16,
                      color: AppColors.textSecondary,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      distance,
                      style: AppTypography.bodySmall(context),
                    ),
                    const SizedBox(width: 16),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: promotionColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        promotion,
                        style: AppTypography.bodySmall(context).copyWith(
                          color: promotionColor,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.qr_code_scanner),
                        label: Text('Scan QR', style: AppTypography.buttonText(context)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: const Icon(Icons.restaurant_menu),
                        label: Text('Menu', style: AppTypography.buttonText(context)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.secondary,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class SustainabilityScreen extends StatelessWidget {
  const SustainabilityScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Sustainability',
              style: AppTypography.heading1,
            ),
            const SizedBox(height: 8),
            Text(
              'Our eco-friendly initiatives and packaging solutions',
              style: AppTypography.bodyMedium(context).copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(height: 24),
            _buildSustainabilityBanner(context),
            const SizedBox(height: 24),
            _buildSustainabilityStats(context),
            const SizedBox(height: 24),
            Text(
              'Sustainable Partners',
              style: AppTypography.heading2,
            ),
            const SizedBox(height: 16),
            _buildSustainablePartnerItem(
              context,
              'Golden Dragon',
              'Using 100% biodegradable packaging',
              '75% waste reduction',
              AppColors.green,
            ),
            _buildSustainablePartnerItem(
              context,
              'Taco Corner',
              'Plant-based utensils and containers',
              '3.5x reward points',
              AppColors.green,
            ),
            _buildSustainablePartnerItem(
              context,
              'Sunny Side Up',
              'Locally sourced ingredients and packaging',
              'Carbon neutral',
              AppColors.green,
            ),
            const SizedBox(height: 24),
            _buildJoinSustainabilityCard(context),
          ],
        ),
      ),
    );
  }

  Widget _buildSustainabilityBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.green,
            AppColors.green.withOpacity(0.7),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
      ),
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
                      'Eco-Friendly Packaging Initiative',
                      style: AppTypography.heading2.copyWith(
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Supporting sustainable practices with our ad-supported packaging program',
                      style: AppTypography.bodyMedium(context).copyWith(
                        color: Colors.white.withOpacity(0.9),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.eco,
                  color: Colors.white,
                  size: 36,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.star),
                  label: Text('Earn 3x Points', style: AppTypography.buttonText(context)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.green,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSustainabilityStats(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _buildStatCard(context, '14,500 kg', 'Plastic Saved', AppColors.green)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(context, '45', 'Partner Restaurants', AppColors.primary)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(context, '38%', 'Carbon Footprint Reduced', AppColors.secondary)),
      ],
    );
  }

  Widget _buildStatCard(BuildContext context, String value, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withOpacity(0.3),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: AppTypography.heading2.copyWith(
              color: color,
              fontSize: 20,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: AppTypography.bodySmall(context).copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSustainablePartnerItem(
      BuildContext context, String name, String description, String badge, Color badgeColor) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(
          color: AppColors.green.withOpacity(0.3),
          width: 1,
        ),
      ),
      elevation: 0,
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.green.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.restaurant,
                color: AppColors.green,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: AppTypography.bodyMedium(context).copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: AppTypography.bodySmall(context),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: badgeColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                badge,
                style: AppTypography.bodySmall(context).copyWith(
                  color: badgeColor,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildJoinSustainabilityCard(BuildContext context) {
    return Card(
      elevation: 0,
      color: AppColors.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: AppColors.secondary.withOpacity(0.2),
          width: 1,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Are you a restaurant owner?',
              style: AppTypography.heading2.copyWith(
                color: AppColors.secondary,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Join our eco-friendly packaging initiative and get free sustainable packaging funded by local business advertisements.',
              style: AppTypography.bodyMedium(context),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.add_business),
              label: Text('Join as Partner', style: AppTypography.buttonText(context)),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.secondary,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.background,
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const SizedBox(height: 16),
            _buildProfileHeader(context),
            const SizedBox(height: 24),
            _buildAccountOptions(context),
            const SizedBox(height: 16),
            _buildPreferences(context),
            const SizedBox(height: 16),
            _buildSupportSection(context),
            const SizedBox(height: 40),
            Text(
              'FeidUp v1.0',
              style: AppTypography.bodySmall(context).copyWith(
                color: AppColors.textSecondary.withOpacity(0.7),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: Colors.white,
            shape: BoxShape.circle,
            border: Border.all(
              color: AppColors.primary,
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: AppColors.primary.withOpacity(0.2),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: CircleAvatar(
            radius: 50,
            backgroundColor: AppColors.primary.withOpacity(0.1),
            child: Icon(
              Icons.person,
              size: 60,
              color: AppColors.primary,
            ),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          'Jane Doe',
          style: AppTypography.heading1.copyWith(
            fontSize: 28,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'jane.doe@example.com',
          style: AppTypography.bodyMedium(context).copyWith(
            color: AppColors.textSecondary,
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.primary.withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.star,
                color: AppColors.primary,
                size: 20,
              ),
              const SizedBox(width: 8),
              Text(
                'Premium Member',
                style: AppTypography.bodyMedium(context).copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAccountOptions(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 0,
      child: Column(
        children: [
          _buildOptionTile(
            context,
            'Edit Profile',
            Icons.edit,
            AppColors.primary,
            () {},
          ),
          const Divider(height: 1, indent: 56),
          _buildOptionTile(
            context,
            'Payment Methods',
            Icons.payment,
            AppColors.secondary,
            () {},
          ),
          const Divider(height: 1, indent: 56),
          _buildOptionTile(
            context,
            'Transaction History',
            Icons.receipt_long,
            AppColors.accent,
            () {},
          ),
        ],
      ),
    );
  }

  Widget _buildPreferences(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 0,
      child: Column(
        children: [
          _buildOptionTile(
            context,
            'Notifications',
            Icons.notifications_none,
            AppColors.primary,
            () {},
          ),
          const Divider(height: 1, indent: 56),
          _buildOptionTile(
            context,
            'Privacy Settings',
            Icons.privacy_tip_outlined,
            AppColors.secondary,
            () {},
          ),
          const Divider(height: 1, indent: 56),
          _buildSwitchTile(
            context,
            'Sustainability Preferences',
            Icons.eco_outlined,
            AppColors.green,
            true,
          ),
        ],
      ),
    );
  }

  Widget _buildSupportSection(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      elevation: 0,
      child: Column(
        children: [
          _buildOptionTile(
            context,
            'Help & Support',
            Icons.help_outline,
            AppColors.secondary,
            () {},
          ),
          const Divider(height: 1, indent: 56),
          _buildOptionTile(
            context,
            'About FeidUp',
            Icons.info_outline,
            AppColors.primary,
            () {},
          ),
          const Divider(height: 1, indent: 56),
          _buildOptionTile(
            context,
            'Terms & Conditions',
            Icons.description_outlined,
            AppColors.textSecondary,
            () {},
          ),
          const Divider(height: 1, indent: 56),
          _buildOptionTile(
            context,
            'Logout',
            Icons.logout,
            AppColors.error,
            () {},
          ),
        ],
      ),
    );
  }

  Widget _buildOptionTile(
      BuildContext context, String title, IconData icon, Color iconColor, VoidCallback onTap) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: iconColor.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          color: iconColor,
        ),
      ),
      title: Text(
        title,
        style: AppTypography.bodyMedium(context),
      ),
      trailing: Icon(
        Icons.chevron_right,
        color: AppColors.textSecondary,
      ),
      onTap: onTap,
    );
  }

  Widget _buildSwitchTile(
      BuildContext context, String title, IconData icon, Color iconColor, bool value) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: iconColor.withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          color: iconColor,
        ),
      ),
      title: Text(
        title,
        style: AppTypography.bodyMedium(context),
      ),
      trailing: Switch(
        value: value,
        activeColor: AppColors.green,
        onChanged: (value) {},
      ),
    );
  }
}

class PaymentTab extends StatefulWidget {
  const PaymentTab({Key? key}) : super(key: key);

  @override
  _PaymentTabState createState() => _PaymentTabState();
}

class _PaymentTabState extends State<PaymentTab> with SingleTickerProviderStateMixin {
  final PageController _pageController = PageController();
  late AnimationController _animationController;
  late Animation<double> _animation;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 400),
    );
    _animation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeInOut,
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.background,
        image: DecorationImage(
          image: const AssetImage('assets/logos/company_logo.png'),
          opacity: 0.03,
          fit: BoxFit.cover,
        ),
      ),
      child: FadeTransition(
        opacity: _animation,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 0.05),
            end: Offset.zero,
          ).animate(_animation),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Easy Payments',
                    style: AppTypography.heading1.copyWith(
                      color: AppColors.primary,
                      fontSize: 28,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Pay securely at any participating restaurant',
                    style: AppTypography.bodyLarge(context).copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildPaymentOptions(),
                  const SizedBox(height: 32),
                  _buildQRScanner(),
                  const SizedBox(height: 32),
                  _buildRecentTransactions(),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPaymentOptions() {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Payment Methods',
                  style: AppTypography.heading2.copyWith(
                    fontSize: 18,
                  ),
                ),
                TextButton.icon(
                  onPressed: () {
                    // Navigate to payment methods screen
                  },
                  icon: const Icon(Icons.add, size: 16),
                  label: Text(
                    'Add New',
                    style: AppTypography.bodySmall(context).copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 40,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _buildPaymentMethod(
                    'FeidUP Wallet',
                    Icons.account_balance_wallet,
                    AppColors.primary,
                    isSelected: true,
                  ),
                  _buildPaymentMethod(
                    'Credit Card',
                    Icons.credit_card,
                    AppColors.secondary,
                  ),
                  _buildPaymentMethod(
                    'Mobile Pay',
                    Icons.smartphone,
                    AppColors.accent,
                  ),
                  _buildPaymentMethod(
                    'Gift Card',
                    Icons.card_giftcard,
                    AppColors.green,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPaymentMethod(
    String label,
    IconData icon,
    Color color, {
    bool isSelected = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(right: 12),
      child: Material(
        color: isSelected ? color : AppColors.background,
        borderRadius: BorderRadius.circular(20),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            // Handle payment method selection
          },
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: !isSelected ? Border.all(color: AppColors.border) : null,
            ),
            child: Row(
              children: [
                Icon(
                  icon,
                  size: 18,
                  color: isSelected ? Colors.white : color,
                ),
                const SizedBox(width: 8),
                Text(
                  label,
                  style: AppTypography.bodySmall(context).copyWith(
                    color: isSelected ? Colors.white : AppColors.textPrimary,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQRScanner() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Quick Pay',
          style: AppTypography.heading2.copyWith(
            fontSize: 18,
          ),
        ),
        const SizedBox(height: 16),
        Center(
          child: GestureDetector(
            onTap: () {
              // Open QR scanner
            },
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.shadow,
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.qr_code_scanner,
                      color: AppColors.primary,
                      size: 48,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Scan to Pay',
                    style: AppTypography.bodyLarge(context).copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tap to open camera',
                    style: AppTypography.bodySmall(context).copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildQuickAction(
              Icons.people,
              'Share & Split',
              AppColors.secondary,
            ),
            const SizedBox(width: 16),
            _buildQuickAction(
              Icons.receipt_long,
              'Request Payment',
              AppColors.accent,
            ),
            const SizedBox(width: 16),
            _buildQuickAction(
              Icons.history,
              'History',
              AppColors.green,
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickAction(IconData icon, String label, Color color) {
    return Column(
      children: [
        Material(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
          child: InkWell(
            borderRadius: BorderRadius.circular(12),
            onTap: () {
              // Handle quick action tap
            },
            child: Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                color: color,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: AppTypography.bodySmall(context),
        ),
      ],
    );
  }

  Widget _buildRecentTransactions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Recent Transactions',
              style: AppTypography.heading2.copyWith(
                fontSize: 18,
              ),
            ),
            TextButton(
              onPressed: () {
                // Navigate to transactions history screen
              },
              child: Text(
                'View All',
                style: AppTypography.bodySmall(context).copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 3, // Show only recent 3 transactions
          itemBuilder: (context, index) {
            final transactions = [
              {
                'name': 'Mama\'s Kitchen',
                'date': 'Today, 2:30 PM',
                'amount': '-\$24.50',
                'status': 'Completed',
                'earned': '+245 points',
              },
              {
                'name': 'Golden Dragon',
                'date': 'Yesterday, 7:15 PM',
                'amount': '-\$32.75',
                'status': 'Completed',
                'earned': '+328 points',
              },
              {
                'name': 'Reward Redemption',
                'date': '21 Apr, 1:40 PM',
                'amount': '+\$10.00',
                'status': 'Redeemed',
                'earned': '-15000 points',
              },
            ];
            
            final transaction = transactions[index];
            final isNegative = transaction['amount']!.contains('-');
            
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: isNegative
                          ? AppColors.primary.withOpacity(0.1)
                          : AppColors.green.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      isNegative ? Icons.shopping_bag : Icons.card_giftcard,
                      color: isNegative ? AppColors.primary : AppColors.green,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          transaction['name']!,
                          style: AppTypography.bodyMedium(context).copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          transaction['date']!,
                          style: AppTypography.bodySmall(context).copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        transaction['amount']!,
                        style: AppTypography.bodyMedium(context).copyWith(
                          fontWeight: FontWeight.bold,
                          color: isNegative ? AppColors.textPrimary : AppColors.green,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: isNegative
                              ? AppColors.primary.withOpacity(0.1)
                              : AppColors.green.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          transaction['earned']!,
                          style: AppTypography.bodySmall(context).copyWith(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: isNegative
                                ? AppColors.primary
                                : AppColors.green,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

class RewardsTab extends StatefulWidget {
  const RewardsTab({Key? key}) : super(key: key);

  @override
  _RewardsTabState createState() => _RewardsTabState();
}

class _RewardsTabState extends State<RewardsTab> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _animation;
  final int _totalPoints = 3275;
  final double _cashValue = 32.75;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _animation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeOutQuart,
    );
    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.background,
        image: DecorationImage(
          image: const AssetImage('assets/logos/company_logo.png'),
          opacity: 0.03,
          fit: BoxFit.cover,
        ),
      ),
      child: FadeTransition(
        opacity: _animation,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 0.05),
            end: Offset.zero,
          ).animate(_animation),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 16),
                    _buildRewardsHeader(),
                    const SizedBox(height: 24),
                    _buildPointsCard(),
                    const SizedBox(height: 24),
                    _buildRewardCategories(),
                    const SizedBox(height: 24),
                    _buildExclusiveOffers(),
                    const SizedBox(height: 24),
                    _buildRedeemHistory(),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRewardsHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Your Rewards',
              style: AppTypography.heading1.copyWith(
                color: AppColors.primary,
                fontSize: 28,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              'Earn & redeem at participating restaurants',
              style: AppTypography.bodyMedium(context).copyWith(
                color: AppColors.textSecondary,
              ),
            ),
          ],
        ),
        Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: AppColors.shadow.withOpacity(0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: IconButton(
            onPressed: () {
              // Navigate to rewards settings
            },
            icon: Icon(
              Icons.settings,
              color: AppColors.primary,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPointsCard() {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppColors.primary,
            AppColors.primary.withBlue(AppColors.primary.blue + 40),
          ],
        ),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Available Points',
                  style: AppTypography.heading2.copyWith(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 16,
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    children: [
                      Text(
                        'Level:',
                        style: AppTypography.bodySmall(context).copyWith(
                          color: Colors.white.withOpacity(0.9),
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Gold',
                        style: AppTypography.bodySmall(context).copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                TweenAnimationBuilder<int>(
                  tween: IntTween(begin: 0, end: _totalPoints),
                  duration: const Duration(seconds: 2),
                  builder: (context, value, child) {
                    return Text(
                      value.toString(),
                      style: AppTypography.heading1.copyWith(
                        color: Colors.white,
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                      ),
                    );
                  },
                ),
                const SizedBox(width: 8),
                Text(
                  'points',
                  style: AppTypography.bodyLarge(context).copyWith(
                    color: Colors.white.withOpacity(0.9),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0, end: _cashValue),
              duration: const Duration(seconds: 2),
              builder: (context, value, child) {
                return Text(
                  'Cash Value: \$${value.toStringAsFixed(2)}',
                  style: AppTypography.bodyMedium(context).copyWith(
                    color: Colors.white.withOpacity(0.8),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildRewardActionButton(
                  'Redeem',
                  Icons.redeem,
                  Colors.white,
                ),
                _buildRewardActionButton(
                  'Cash Out',
                  Icons.account_balance_wallet,
                  Colors.white,
                ),
                _buildRewardActionButton(
                  'Transfer',
                  Icons.swap_horiz,
                  Colors.white,
                ),
                _buildRewardActionButton(
                  'History',
                  Icons.history,
                  Colors.white,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRewardActionButton(String label, IconData icon, Color color) {
    return Column(
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: () {
                // Handle button tap
              },
              child: Icon(
                icon,
                color: color,
                size: 20,
              ),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          label,
          style: AppTypography.bodySmall(context).copyWith(
            color: color.withOpacity(0.9),
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildRewardCategories() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Reward Categories',
          style: AppTypography.heading2.copyWith(
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 10),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildRewardCategory(
                'Restaurant\nVouchers',
                Icons.restaurant,
                AppColors.primary,
              ),
              _buildRewardCategory(
                'Cashback\nRewards',
                Icons.attach_money,
                AppColors.green,
              ),
              _buildRewardCategory(
                'Limited\nOffers',
                Icons.local_offer,
                AppColors.secondary,
              ),
              _buildRewardCategory(
                'Gift\nCards',
                Icons.card_giftcard,
                AppColors.accent,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRewardCategory(String label, IconData icon, Color color) {
    return Container(
      width: 110,
      height: 120,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(color: AppColors.border.withOpacity(0.3)),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            // Navigate to category
          },
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    icon,
                    color: color,
                    size: 24,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  label,
                  textAlign: TextAlign.center,
                  style: AppTypography.bodySmall(context).copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildExclusiveOffers() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Exclusive Offers',
              style: AppTypography.heading2.copyWith(
                fontSize: 20,
              ),
            ),
            TextButton(
              onPressed: () {
                // See all offers
              },
              child: Text(
                'See All',
                style: AppTypography.bodySmall(context).copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              _buildOfferCard(
                'Mama\'s Kitchen',
                '20% off your next meal',
                '500 points',
                AppColors.secondary,
                Icons.restaurant,
                'Valid until: Apr 30, 2025',
              ),
              _buildOfferCard(
                'Golden Dragon',
                'Free appetizer with any order',
                '350 points',
                AppColors.green,
                Icons.lunch_dining,
                'Valid until: May 15, 2025',
              ),
              _buildOfferCard(
                'Cash Reward',
                '\$10 cashback to your account',
                '15000 points',
                AppColors.primary,
                Icons.account_balance_wallet,
                'Always available',
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildOfferCard(String title, String description, String points,
      Color color, IconData icon, String validity) {
    return Container(
      width: 200,
      margin: const EdgeInsets.only(right: 16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadow.withOpacity(0.1),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
        border: Border.all(color: AppColors.border.withOpacity(0.3)),
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        child: InkWell(
          borderRadius: BorderRadius.circular(16),
          onTap: () {
            // View offer details
          },
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(
                        icon,
                        color: color,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        title,
                        style: AppTypography.bodyMedium(context).copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  description,
                  style: AppTypography.bodyMedium(context).copyWith(
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  validity,
                  style: AppTypography.bodySmall(context).copyWith(
                    color: AppColors.textSecondary,
                    fontSize: 11,
                  ),
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    points,
                    style: AppTypography.bodySmall(context).copyWith(
                      color: color,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRedeemHistory() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Recent Redemptions',
          style: AppTypography.heading2.copyWith(
            fontSize: 20,
          ),
        ),
        const SizedBox(height: 16),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: 3,
          itemBuilder: (context, index) {
            final redemptions = [
              {
                'name': 'Cash Reward',
                'date': '21 Apr, 1:40 PM',
                'points': '-15000 points',
                'status': 'Redeemed',
                'value': '+\$10.00',
              },
              {
                'name': 'Mama\'s Kitchen Voucher',
                'date': '15 Apr, 5:20 PM',
                'points': '-500 points',
                'status': 'Redeemed',
                'value': '20% Off',
              },
              {
                'name': 'Gift Card',
                'date': '3 Apr, 11:10 AM',
                'points': '-1500 points',
                'status': 'Redeemed',
                'value': '\$15 Value',
              },
            ];

            final redemption = redemptions[index];

            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.border.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(
                      index == 0
                          ? Icons.account_balance_wallet
                          : (index == 1 ? Icons.restaurant : Icons.card_giftcard),
                      color: AppColors.primary,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          redemption['name']!,
                          style: AppTypography.bodyMedium(context).copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          redemption['date']!,
                          style: AppTypography.bodySmall(context).copyWith(
                            color: AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        redemption['value']!,
                        style: AppTypography.bodyMedium(context).copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          redemption['points']!,
                          style: AppTypography.bodySmall(context).copyWith(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
