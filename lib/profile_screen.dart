import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final TextEditingController gradeController = TextEditingController();
    final TextEditingController interestsController = TextEditingController();
    final TextEditingController skillsController = TextEditingController();
    final TextEditingController domainController = TextEditingController();

    return Scaffold(
      appBar: AppBar(
        title: const Text("Student Profile"),
        backgroundColor: Colors.blue,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 20),
        child: Column(
          children: [
            const SizedBox(height: 20),
            const Icon(Icons.school, size: 100, color: Colors.blue),
            const SizedBox(height: 20),
            const Text(
              "Step 3.4: Student Profile",
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 30),

            // Grade
            TextField(
              controller: gradeController,
              decoration: InputDecoration(
                labelText: "Grade",
                prefixIcon: const Icon(Icons.grade),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Interests
            TextField(
              controller: interestsController,
              decoration: InputDecoration(
                labelText: "Interests",
                prefixIcon: const Icon(Icons.interests),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Skills
            TextField(
              controller: skillsController,
              decoration: InputDecoration(
                labelText: "Skills",
                prefixIcon: const Icon(Icons.build),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Preferred Domain
            TextField(
              controller: domainController,
              decoration: InputDecoration(
                labelText: "Preferred Domain",
                prefixIcon: const Icon(Icons.work),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
            const SizedBox(height: 30),

            // SAVE BUTTON
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                onPressed: () {
                  // Collect data and navigate to recommendations
                  Navigator.pushNamed(context, '/recommendation');
                },
                child: const Text("Save Profile"),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
