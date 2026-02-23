import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to login page', async ({ page }) => {
    await page.click('text=Login');
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1')).toContainText(/login|sign in/i);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.click('text=Register');
    await expect(page).toHaveURL(/.*register/);
    await expect(page.locator('h1')).toContainText(/register|sign up/i);
  });

  test('should show validation errors on empty login form', async ({ page }) => {
    await page.goto('/login');
    await page.click('button[type="submit"]');

    // Should show validation errors
    await expect(page.locator('text=/email.*required/i')).toBeVisible();
    await expect(page.locator('text=/password.*required/i')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=/invalid.*credentials/i')).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    await page.goto('/register');

    const timestamp = Date.now();
    const email = `test${timestamp}@example.com`;

    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[type="email"]', email);
    await page.fill('input[name="phone"]', '+1234567890');
    await page.fill('input[type="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.fill('input[type="date"]', '1990-01-01');

    await page.click('button[type="submit"]');

    // Should redirect to dashboard after successful registration
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/, { timeout: 10000 });

    // Should show user menu or profile
    await expect(page.locator('text=/profile|account|logout/i')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    // Then logout
    await page.click('text=/logout/i');

    // Should redirect to home or login page
    await expect(page).toHaveURL(/.*\/(|login)/);
  });

  test('should persist authentication after page reload', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/.*dashboard/);

    // Reload page
    await page.reload();

    // Should still be on dashboard (authenticated)
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe('Expert Registration', () => {
  test('should register as an expert with additional fields', async ({ page }) => {
    await page.goto('/register');

    // Select expert role
    await page.click('input[value="expert"]');

    const timestamp = Date.now();
    const email = `expert${timestamp}@example.com`;

    await page.fill('input[name="firstName"]', 'Dr. Sarah');
    await page.fill('input[name="lastName"]', 'Smith');
    await page.fill('input[type="email"]', email);
    await page.fill('input[name="phone"]', '+1234567891');
    await page.fill('input[type="password"]', 'Password123!');
    await page.fill('input[name="confirmPassword"]', 'Password123!');
    await page.fill('input[type="date"]', '1985-01-01');

    // Expert-specific fields
    await page.fill('textarea[name="bio"]', 'Experienced psychologist');
    await page.fill('input[name="hourlyRate"]', '150');
    await page.selectOption('select[name="specialization"]', ['Anxiety', 'Depression']);

    await page.click('button[type="submit"]');

    // Should redirect to expert dashboard
    await expect(page).toHaveURL(/.*dashboard\/expert/, { timeout: 10000 });
  });
});
