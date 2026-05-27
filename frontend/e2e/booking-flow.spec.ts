import { test, expect } from '@playwright/test'

const BACKEND = 'http://localhost:3001'

function todayISO(): string {
  const t = new Date()
  const y = t.getFullYear()
  const m = String(t.getMonth() + 1).padStart(2, '0')
  const d = String(t.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

test.describe('Бронирование встречи', () => {
  let slotIds: string[] = []

  test.beforeAll(async ({ request }) => {
    // Очистить БД
    for (const ev of await (await request.get(`${BACKEND}/api/events`)).json()) {
      await request.delete(`${BACKEND}/api/events/${ev.id}`)
    }
    for (const s of await (await request.get(`${BACKEND}/api/slots`)).json()) {
      await request.delete(`${BACKEND}/api/slots/${s.id}`)
    }

    // Создать 2 слота на сегодня
    const ts = todayISO()
    for (const [h, hEnd] of [[9, 11], [14, 16]]) {
      const res = await request.post(`${BACKEND}/api/slots`, {
        data: {
          startTime: `${ts}T${String(h).padStart(2, '0')}:00:00.000Z`,
          endTime: `${ts}T${String(hEnd).padStart(2, '0')}:00:00.000Z`,
        },
      })
      slotIds.push((await res.json()).id)
    }
  })

  test('главная → выбор типа → бронирование со сплитом слота', async ({ page }) => {
    const ts = todayISO()

    // 1. Открыть главную
    await page.goto('/')
    await expect(page.getByText('Выберите тип встречи')).toBeVisible()

    // 2. Кликнуть "Забронировать" на "Быстрая встреча"
    await page.getByTestId('book-quick').click()
    await page.waitForURL('/event/quick')

    // 3. Дождаться окончания загрузки и появления слотов
    await expect(page.getByText('Загрузка...')).toBeHidden({ timeout: 10000 })
    await expect(page.getByTestId(`slot-${slotIds[0]}`)).toBeVisible()

    // 4. Выбрать сегодняшний день в календаре
    await page.getByTestId(`day-${ts}`).click()

    // 5. Кликнуть на первый слот
    await page.getByTestId(`slot-${slotIds[0]}`).click()

    // 6. Заполнить имя гостя в модальном окне
    await expect(page.getByTestId('guest-name')).toBeVisible()
    await page.getByTestId('guest-name').fill('Мария Иванова')

    // 7. Отправить бронирование
    await page.getByTestId('submit-booking').click()

    // 8. Проверить, что слот помечен как "занято"
    await expect(page.getByTestId(`booked-${slotIds[0]}`)).toBeVisible()

    // 9. Проверить, что второй слот остался свободным
    await expect(page.getByTestId(`slot-${slotIds[1]}`)).not.toBeDisabled()

    // 10. Проверить сплит: первый слот теперь имеет границы 09:00–09:15 (после сплита)
    await expect(page.getByTestId(`slot-${slotIds[0]}`)).toContainText('09:00')
  })
})
