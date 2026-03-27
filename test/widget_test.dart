import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careerai_project/main.dart';

void main() {
  testWidgets('Language selection smoke test', (WidgetTester tester) async {
    // 1. Load the CareerApp
    await tester.pumpWidget(const CareerApp());

    // 2. Look for your new Heading
    expect(find.text('Select Your Preferred Language'), findsOneWidget);

    // 3. Look for your Continue button
    expect(find.text('Continue'), findsOneWidget);
  });
}
