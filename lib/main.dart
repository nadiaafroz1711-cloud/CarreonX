import 'package:careerai_project/dashboard.dart';
import 'package:careerai_project/learning_roadmap_screen.dart';
import 'package:careerai_project/login_screen.dart';
import 'package:careerai_project/profile_screen.dart';
import 'package:careerai_project/signup_screen.dart';
import 'package:careerai_project/splash_screen.dart';
import 'package:careerai_project/language_screen.dart';
import 'package:flutter/material.dart';
// Import your screens from the 'screens' folder
import 'package:careerai_project/screens/login_screen.dart';
import 'package:careerai_project/screens/signup_screen.dart';
import 'package:careerai_project/screens/dashboard_screen.dart';
import 'package:careerai_project/screens/roadmap_screen.dart';
import 'package:careerai_project/screens/profile_screen.dart';
import 'package:careerai_project/screens/splash_screen.dart';

void main() {
  runApp(const CareerAI());
}

class CareerAI extends StatelessWidget {
  const CareerAI({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CareerAI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        useMaterial3: true,
      ),
      // Set the initial screen
      initialRoute: '/',
      routes: {
        '/': (context) => const SplashScreen(),
        '/login': (context) => const LoginScreen(),
        '/signup': (context) => const SignupScreen(),
        '/dashboard': (context) => const DashboardScreen(),
        '/roadmap': (context) => const RoadmapScreen(),
        '/profile': (context) => const ProfileScreen(),
        '/language': (context) => const LanguageScreen(),
      },
    );
  }
}
