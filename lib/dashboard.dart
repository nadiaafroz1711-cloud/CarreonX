import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Dashboard"), centerTitle: true),
      body: GridView.count(
        padding: const EdgeInsets.all(20),
        crossAxisCount: 2,
        mainAxisSpacing: 20,
        crossAxisSpacing: 20,
        children: [
          _menuItem(context, Icons.person, "Profile", Colors.blue, '/profile'),
          _menuItem(context, Icons.school, "Learning", Colors.orange, '/roadmap'),
          _menuItem(context, Icons.quiz, "Exams", Colors.green, '/exam'),
          _menuItem(context, Icons.insights, "AI Roadmap", Colors.purple, '/recommendation'),
          _menuItem(context, Icons.work, "Jobs", Colors.indigo, '/jobs'),
          _menuItem(context, Icons.mic, "Interview Prep", Colors.teal, '/interview'),
        ],
      ),
    );
  }

  Widget _menuItem(BuildContext context, IconData icon, String label, Color color, String route) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, route),
      child: Card(
      elevation: 5,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 50, color: color),
          const SizedBox(height: 10),
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
