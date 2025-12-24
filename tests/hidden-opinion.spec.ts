import { test, expect } from '@playwright/test';

test.describe('Hidden Opinion Mode', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show Hidden Opinion mode option on home page', async ({ page }) => {
    await page.goto('/');

    // Check that the Hidden Opinion mode card exists
    await expect(page.getByText('Opinión Oculta')).toBeVisible();
    await expect(page.getByText('NUEVO')).toBeVisible();
    await expect(page.getByText('Todos responden una pregunta. El impostor recibe una diferente.')).toBeVisible();
  });

  test('should start Hidden Opinion game with 3 players', async ({ page }) => {
    await page.goto('/');

    // Click on Hidden Opinion mode
    await page.getByText('Opinión Oculta').click();

    // Should go to player setup
    await expect(page.getByText('Jugadores', { exact: true })).toBeVisible();
    await expect(page.getByText('Opinión Oculta', { exact: false })).toBeVisible();

    // Enter player names
    const inputs = page.locator('input[placeholder^="Jugador"]');
    await inputs.nth(0).fill('Ana');
    await inputs.nth(1).fill('Bob');
    await inputs.nth(2).fill('Carlos');

    // Start game
    await page.getByRole('button', { name: 'JUGAR' }).click();

    // Should be on word reveal phase - check for the "Ver Mi Pregunta" button
    await expect(page.getByText('Ver Mi Pregunta')).toBeVisible({ timeout: 10000 });
  });

  test('should show question and allow answer input', async ({ page }) => {
    await page.goto('/');

    // Setup game
    await page.getByText('Opinión Oculta').click();
    const inputs = page.locator('input[placeholder^="Jugador"]');
    await inputs.nth(0).fill('Ana');
    await inputs.nth(1).fill('Bob');
    await inputs.nth(2).fill('Carlos');
    await page.getByRole('button', { name: 'JUGAR' }).click();

    // Wait for question phase
    await expect(page.getByText('Ver Mi Pregunta')).toBeVisible({ timeout: 10000 });

    // Click to see question
    await page.getByRole('button', { name: 'Ver Mi Pregunta' }).click();

    // Should show question and answer input
    await expect(page.getByText('Pregunta para')).toBeVisible();
    await expect(page.getByPlaceholder('Escribe tu respuesta aquí...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar y Pasar' })).toBeVisible();
  });

  test('should submit answers and proceed to answer reveal', async ({ page }) => {
    await page.goto('/');

    // Setup game with 3 players
    await page.getByText('Opinión Oculta').click();
    const inputs = page.locator('input[placeholder^="Jugador"]');
    await inputs.nth(0).fill('Ana');
    await inputs.nth(1).fill('Bob');
    await inputs.nth(2).fill('Carlos');
    await page.getByRole('button', { name: 'JUGAR' }).click();

    // Complete answers for all 3 players
    for (let i = 0; i < 3; i++) {
      await expect(page.getByText('Ver Mi Pregunta')).toBeVisible({ timeout: 10000 });
      await page.getByRole('button', { name: 'Ver Mi Pregunta' }).click();

      // Fill in answer
      await page.getByPlaceholder('Escribe tu respuesta aquí...').fill(`Respuesta ${i + 1}`);
      await page.getByRole('button', { name: 'Enviar y Pasar' }).click();
    }

    // Should now be on answer reveal phase
    await expect(page.getByText('La pregunta era:')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Alguien tenía una pregunta diferente')).toBeVisible();
    await expect(page.getByText('Respuestas de todos:')).toBeVisible();
  });

  test('should reveal impostor after discussion', async ({ page }) => {
    await page.goto('/');

    // Quick setup
    await page.getByText('Opinión Oculta').click();
    const inputs = page.locator('input[placeholder^="Jugador"]');
    await inputs.nth(0).fill('Ana');
    await inputs.nth(1).fill('Bob');
    await inputs.nth(2).fill('Carlos');
    await page.getByRole('button', { name: 'JUGAR' }).click();

    // Complete all answers
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Ver Mi Pregunta' }).click({ timeout: 10000 });
      await page.getByPlaceholder('Escribe tu respuesta aquí...').fill(`Test ${i}`);
      await page.getByRole('button', { name: 'Enviar y Pasar' }).click();
    }

    // Click reveal impostor
    await page.getByRole('button', { name: 'Revelar Impostor' }).click({ timeout: 10000 });

    // Should show results
    await expect(page.getByText('¡REVELACIÓN!')).toBeVisible();
    await expect(page.getByText('El impostor era:')).toBeVisible();
    await expect(page.getByText('Pregunta de los civiles:')).toBeVisible();
    await expect(page.getByText('Pregunta del impostor:')).toBeVisible();
    await expect(page.getByText('Respuestas y roles:')).toBeVisible();
  });

  test('should allow playing again after game ends', async ({ page }) => {
    await page.goto('/');

    // Quick setup and complete game
    await page.getByText('Opinión Oculta').click();
    const inputs = page.locator('input[placeholder^="Jugador"]');
    await inputs.nth(0).fill('Ana');
    await inputs.nth(1).fill('Bob');
    await inputs.nth(2).fill('Carlos');
    await page.getByRole('button', { name: 'JUGAR' }).click();

    // Complete all answers
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Ver Mi Pregunta' }).click({ timeout: 10000 });
      await page.getByPlaceholder('Escribe tu respuesta aquí...').fill(`Test ${i}`);
      await page.getByRole('button', { name: 'Enviar y Pasar' }).click();
    }

    // Reveal and play again
    await page.getByRole('button', { name: 'Revelar Impostor' }).click({ timeout: 10000 });
    await page.getByRole('button', { name: 'Jugar Otra Vez' }).click();

    // Should start new game - either show question reveal or be ready to show questions
    await expect(page.getByText('Ver Mi Pregunta')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Mobile responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('should be usable on mobile', async ({ page }) => {
    await page.goto('/');

    // Mode selection should be visible and tappable
    await expect(page.getByText('Opinión Oculta')).toBeVisible();
    await page.getByText('Opinión Oculta').click();

    // Player setup should work
    const inputs = page.locator('input[placeholder^="Jugador"]');
    await inputs.nth(0).fill('Ana');
    await inputs.nth(1).fill('Bob');
    await inputs.nth(2).fill('Carlos');
    await page.getByRole('button', { name: 'JUGAR' }).click();

    // Question phase should be mobile-friendly
    await expect(page.getByText('Ver Mi Pregunta')).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: 'Ver Mi Pregunta' }).click();

    // Textarea should be visible and usable
    const textarea = page.getByPlaceholder('Escribe tu respuesta aquí...');
    await expect(textarea).toBeVisible();
    await textarea.fill('Mi respuesta en móvil');

    // Submit button should be visible
    await expect(page.getByRole('button', { name: 'Enviar y Pasar' })).toBeVisible();
  });
});
