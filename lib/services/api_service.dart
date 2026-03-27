import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  // Use 10.0.2.2 if you are using an Android Emulator
  // Use 127.0.0.1 if you are using Chrome/Web
  final String baseUrl = "http://127.0.0.1:8000";

  Future<List<dynamic>> fetchRoadmap() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/roadmap'));

      if (response.statusCode == 200) {
        return json.decode(response.body);
      } else {
        throw Exception("Failed to load roadmap: ${response.statusCode}");
      }
    } catch (e) {
      throw Exception("Could not connect to backend: $e");
    }
  }
}
