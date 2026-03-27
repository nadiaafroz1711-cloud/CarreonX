import 'package:flutter/material.dart';

class ExamScreen extends StatelessWidget {
  const ExamScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: const Text("Quick Quiz"),
          actions: const [Center(child: Text("05:00 ")), Icon(Icons.timer)]),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const LinearProgressIndicator(value: 0.3),
          const SizedBox(height: 20),
          _quizItem("1. What does AI stand for?",
              ["Artistic Intel", "Artificial Intelligence", "Auto Info"]),
          _quizItem(
              "2. Which is a Flutter language?", ["Java", "Swift", "Dart"]),
        ],
      ),
    );
  }

  Widget _quizItem(String question, List<String> options) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(question, style: const TextStyle(fontWeight: FontWeight.bold)),
        ...options.map((o) => RadioListTile(
            value: o,
            groupValue: "",
            title: Text(o, style: const TextStyle(fontSize: 14)),
            onChanged: (v) {})),
        const Divider(),
      ],
    );
  }
}
