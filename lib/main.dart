import 'package:careerai_project/dashboard.dart' show DashboardScreen;
import 'package:careerai_project/exam_screen.dart';
import 'package:careerai_project/language_screen.dart' show LanguageScreen;
import 'package:careerai_project/learning_roadmap_screen.dart'
    show RoadmapScreen;
import 'package:careerai_project/login_screen.dart' show LoginScreen;
import 'package:careerai_project/profile_screen.dart';
import 'package:careerai_project/recommendation_screen.dart'
    show RecommendationScreen;
import 'package:careerai_project/signup_screen.dart' show SignupScreen;
import 'package:careerai_project/splash_screen.dart';
import 'package:flutter/material.dart';

// Ensure these files exist in lib/screens/ and the classes inside are named correctly
import 'package:careerai_project/screens/language_screen.dart';
import 'package:careerai_project/screens/login_screen.dart';
import 'package:careerai_project/screens/signup_screen.dart';
import 'package:careerai_project/screens/dashboard_screen.dart';
import 'package:careerai_project/screens/profile_screen.dart';
import 'package:careerai_project/screens/recommendation_screen.dart';
import 'package:careerai_project/screens/roadmap_screen.dart';
import 'package:careerai_project/screens/exam_screen.dart';

void main() {
  runApp(const CareerApp());
}

class CareerApp extends StatelessWidget {
  const CareerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Career AI',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),

        // Global Styling (Your "CSS")
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.indigo,
            foregroundColor: Colors.white,
            minimumSize: const Size(double.infinity, 55),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            elevation: 2,
          ),
        ),
      ),
      // Navigation Logic
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/language': (context) => const LanguageScreen(),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/recommendation': (context) => const RecommendationScreen(),
        '/roadmap': (context) => const RoadmapScreen(),
        '/exam': (context) => const ExamScreen(),
      },
    );
  }
}
