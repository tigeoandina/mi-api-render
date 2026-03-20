import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';

class AuthService {
  static const String baseUrl = 'http://localhost:3000';

  // Login
  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success']) {
        // Guardar token y usuario
        await _saveToken(data['data']['token']);
        await _saveUser(User.fromJson(data['data']['user']));
        return data;
      } else {
        throw Exception(data['error'] ?? 'Error al iniciar sesión');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Registro
  Future<Map<String, dynamic>> register(
    String nombre,
    String email,
    String password,
    int edad,
  ) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/auth/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'nombre': nombre,
          'email': email,
          'password': password,
          'edad': edad,
        }),
      );

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 && data['success']) {
        await _saveToken(data['data']['token']);
        await _saveUser(User.fromJson(data['data']['user']));
        return data;
      } else {
        throw Exception(data['error'] ?? 'Error al registrar');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  // Logout
  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('user');
  }

  // Guardar token
  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  // Guardar usuario
  Future<void> _saveUser(User user) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('user', jsonEncode(user.toJson()));
  }

  // Obtener token
  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  // Obtener usuario actual
  Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString('user');
    if (userJson != null) {
      return User.fromJson(jsonDecode(userJson));
    }
    return null;
  }

  // Verificar si está autenticado
  Future<bool> isAuthenticated() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }
}