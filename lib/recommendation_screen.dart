import 'package:flutter/material.dart';

class RecommendationScreen extends StatelessWidget {
  const RecommendationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Career Recommendation")),
      body: const Padding(
        padding: EdgeInsets.all(30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Recommended Career: Software Engineer",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 20),
            Text(
              "Required Skills: Programming, Problem-Solving, Communication",
            ),
            SizedBox(height: 20),
            Text(
              "Career Explanation: Software engineers design, build, and maintain applications that solve real-world problems.",
            ),
          ],
        ),
      ),
    );
  }
}
