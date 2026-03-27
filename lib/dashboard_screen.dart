import 'package:flutter/material.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar:
          AppBar(title: const Text("Career AI Dashboard"), centerTitle: true),
      body: GridView.count(
        padding: const EdgeInsets.all(20),
        crossAxisCount: 2,
        mainAxisSpacing: 15,
        crossAxisSpacing: 15,
        children: [
          _card(context, "Profile", Icons.person, Colors.blue, '/profile'),
          _card(context, "Exams", Icons.quiz, Colors.green, '/exam'),
          _card(context, "Roadmap", Icons.map, Colors.orange, '/roadmap'),
          _card(context, "AI Advice", Icons.psychology, Colors.purple,
              '/recommendation'),
        ],
      ),
    );
  }

  Widget _card(BuildContext context, String title, IconData icon, Color color,
      String route) {
    return InkWell(
      onTap: () => Navigator.pushNamed(context, route),
      child: Card(
        elevation: 4,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50, color: color),
            const SizedBox(height: 10),
            Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
