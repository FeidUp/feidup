import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'colors.dart';

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