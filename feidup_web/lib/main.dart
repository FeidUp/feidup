import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// Define a color palette class for better organization and consistency
class AppColors {
  // Brand logo colors
  static const Color logoRed = Color(0xFFED4040);        // Logo red - #ed4040
  static const Color logoOffWhite = Color(0xFFF6F2E8);   // Logo off-white - #f6f2e8
  
  // Primary brand colors
  static const Color primary = Color(0xFFED4040);        // Logo red as primary
  static const Color secondary = Color(0xFF2E4057);      // Deep navy - Complementary to red
  static const Color accent = Color(0xFFFF9B54);         // Warm orange - Complementary accent
  
  // Interface colors
  static const Color background = Color(0xFFF6F2E8);     // Logo off-white as background
  static const Color surface = Colors.white;             // White - Surface color
  static const Color textPrimary = Color(0xFF2E2E2E);    // Near black - Primary text
  static const Color textSecondary = Color(0xFF707070);  // Dark gray - Secondary text
  
  // Feedback colors
  static const Color success = Color(0xFF43AA8B);        // Green - Success actions
  static const Color error = Color(0xFFED4040);          // Logo red - Error states
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
      title: 'FeidUp',
      theme: ThemeData(
        primaryColor: AppColors.primary,
        scaffoldBackgroundColor: AppColors.background,
        textTheme: GoogleFonts.nunitoTextTheme(
          Theme.of(context).textTheme.apply(
                bodyColor: AppColors.textPrimary,
                displayColor: AppColors.textPrimary,
              ),
        ),
        appBarTheme: const AppBarTheme(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.secondary,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
          ),
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
      ),
      home: const SplashScreen(),
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 2), () {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    });
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
            ],
          ),
        ),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

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
          IconButton(
            icon: const Icon(Icons.account_circle),
            onPressed: () {},
            color: Colors.white,
          ),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          color: AppColors.background,
          image: DecorationImage(
            image: const AssetImage('assets/logos/company_logo.png'),
            opacity: 0.03,
            fit: BoxFit.cover,
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Card(
                elevation: 4,
                margin: const EdgeInsets.all(16),
                color: Colors.white,
                shadowColor: AppColors.secondary.withOpacity(0.3),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(
                    color: AppColors.primary.withOpacity(0.2),
                    width: 1,
                  ),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    children: [
                      Text(
                        'Welcome to FeidUp!',
                        style: AppTypography.heading1.copyWith(
                          color: AppColors.primary,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Scan & earn rewards',
                        style: AppTypography.bodyMedium(context).copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 30),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.qr_code_scanner),
                        label: Text('Scan QR', style: AppTypography.buttonText(context)),
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton.icon(
                        icon: const Icon(Icons.redeem),
                        label: Text('Redeem Rewards', style: AppTypography.buttonText(context)),
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.secondary,
                          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
                        ),
                      ),
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.logoOffWhite.withOpacity(0.5),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Upcoming Events',
                              style: AppTypography.accentHeading.copyWith(fontSize: 20),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              'Check out our special offers and promotional events!',
                              style: AppTypography.bodyMedium(context),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.accent,
        child: const Icon(Icons.star),
        onPressed: () {},
      ),
    );
  }
}
