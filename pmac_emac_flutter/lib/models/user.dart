class User {
  final int id;
  final String nombre;
  final String email;
  final int edad;
  final String rol;

  User({
    required this.id,
    required this.nombre,
    required this.email,
    required this.edad,
    required this.rol,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      nombre: json['nombre'],
      email: json['email'],
      edad: json['edad'],
      rol: json['rol'] ?? 'user',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'nombre': nombre,
      'email': email,
      'edad': edad,
      'rol': rol,
    };
  }
}