import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'package:carreonx_project/dashboard.dart';
import 'package:carreonx_project/language_screen.dart';
import 'package:carreonx_project/learning_roadmap_screen.dart';
import 'package:carreonx_project/login_screen.dart';
import 'package:carreonx_project/profile_screen.dart';
import 'package:carreonx_project/signup_screen.dart';
import 'package:carreonx_project/splash_screen.dart';
import 'package:carreonx_project/exam_screen.dart';
import 'package:carreonx_project/recommendation_screen.dart';
import 'package:carreonx_project/chatbot_screen.dart';
import 'package:carreonx_project/skills_screen.dart';
import 'package:carreonx_project/domain_screen.dart';
import 'package:carreonx_project/jobs_screen.dart';
import 'package:carreonx_project/interview_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
  ]);

  runApp(const CarreonX());
}

class CarreonX extends StatelessWidget {
  const CarreonX({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'CarreonX',
      theme: _buildTheme(),
      initialRoute: '/',
      routes: {
        '/': (_) => const SplashScreen(),
        '/login': (_) => const LoginScreen(),
        '/signup': (_) => const SignupScreen(),
        '/skills': (_) => const SkillsScreen(),
        '/domain': (_) => const DomainScreen(),
        '/dashboard': (_) => const DashboardScreen(),
        '/roadmap': (_) => const RoadmapScreen(),
        '/profile': (_) => const ProfileScreen(),
        '/language': (_) => const LanguageScreen(),
        '/exam': (_) => const ExamScreen(),
        '/recommendation': (_) => const RecommendationScreen(),
        '/chatbot': (_) => const ChatbotScreen(),
        '/jobs': (_) => const JobsScreen(),
        '/interview': (_) => const InterviewScreen(),
      },
    );
  }

  ThemeData _buildTheme() {
    const primary = Color(0xFF6366F1);

    return ThemeData(
      useMaterial3: true,
      colorScheme: const ColorScheme.light(
        primary: primary,
        secondary: Colors.purple,
        tertiary: Colors.cyan,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        elevation: 6,
        color: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: Colors.white,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.grey.shade100,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
      snackBarTheme: const SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
      ),
    );
  }
}
