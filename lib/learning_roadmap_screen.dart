import 'package:careerai_project/api_service.dart';
import 'package:flutter/material.dart';
// CRITICAL: This line tells Flutter where to find the ApiService
import 'package:careerai_project/services/api_service.dart';

class RoadmapScreen extends StatelessWidget {
  const RoadmapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("AI Learning Path")),
      body: FutureBuilder<List<dynamic>>(
        // We call the class here. Note the () after ApiService
        future: ApiService().fetchRoadmap(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text("Error: ${snapshot.error}"));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text("No data found."));
          }

          final roadmapData = snapshot.data!;

          return ListView.builder(
            padding: const EdgeInsets.all(20),
            itemCount: roadmapData.length,
            itemBuilder: (context, index) {
              final step = roadmapData[index];
              return ListTile(
                leading: Icon(
                  step['status'] == 'completed'
                      ? Icons.check_circle
                      : Icons.circle_outlined,
                  color: step['status'] == 'completed'
                      ? Colors.green
                      : Colors.grey,
                ),
                title: Text("Step ${step['step']}: ${step['task']}"),
              );
            },
          );
        },
      ),
    );
  }
}
