import 'package:flutter/material.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(30.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text("Login",
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
            const SizedBox(height: 30),
            const TextField(
                decoration: InputDecoration(
                    labelText: "Email", border: OutlineInputBorder())),
            const SizedBox(height: 15),
            const TextField(
                decoration: InputDecoration(
                    labelText: "Password", border: OutlineInputBorder()),
                obscureText: true),
            const SizedBox(height: 25),
            ElevatedButton(
              onPressed: () =>
                  Navigator.pushReplacementNamed(context, '/dashboard'),
              child: const Text("Login"),
            ),
            TextButton(
              onPressed: () => Navigator.pushNamed(context, '/signup'),
              child: const Text("New user? Create an account"),
            ),
          ],
        ),
      ),
    );
  }
}
