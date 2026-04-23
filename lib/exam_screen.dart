import 'package:flutter/material.dart';

class ExamScreen extends StatefulWidget {
  const ExamScreen({super.key});

  @override
  State<ExamScreen> createState() => _ExamScreenState();
}

class _ExamScreenState extends State<ExamScreen> {
  String? _selectedAnswer1;
  String? _selectedAnswer2;

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
          _quizItem(
              "1. What does AI stand for?",
              ["Artistic Intel", "Artificial Intelligence", "Auto Info"],
              _selectedAnswer1,
              (value) => setState(() => _selectedAnswer1 = value)),
          _quizItem(
              "2. Which is a Flutter language?",
              ["Java", "Swift", "Dart"],
              _selectedAnswer2,
              (value) => setState(() => _selectedAnswer2 = value)),
        ],
      ),
    );
  }

  Widget _quizItem(String question, List<String> options, String? groupValue,
      ValueChanged<String?> onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(question, style: const TextStyle(fontWeight: FontWeight.bold)),
        RadioGroup<String>(
          groupValue: groupValue,
          onChanged: onChanged,
          child: Column(
            children: options
                .map((o) => RadioListTile<String>(
                    value: o,
                    title: Text(o, style: const TextStyle(fontSize: 14))))
                .toList(),
          ),
        ),
        const Divider(),
      ],
    );
  }
}
