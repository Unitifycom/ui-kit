# Переход на единый @unitifycom/ui

Начиная с 0.2.0 устанавливается один пакет. Рабочие копии в Pass не переключаются автоматически: обновление зависимости приложения и его выпуск выполняются отдельно.

| Прежний импорт                                          | Новый импорт                                    |
| ------------------------------------------------------- | ----------------------------------------------- |
| `@open-condo/ui` / `@unitifycom/ui`                     | `@unitifycom/ui`                                |
| `@open-condo/icons` / `@unitifycom/icons`               | `@unitifycom/ui/icons`                          |
| `@unitifycom/icons/Check`                               | `@unitifycom/ui/icons/Check`                    |
| `@unitifycom/condo-ui-common` / `@unitifycom/ui-common` | `@unitifycom/ui` или `@unitifycom/ui/common`    |
| `@unitifycom/ui-common/themes`                          | `@unitifycom/ui/themes`                         |
| `@unitifycom/ui-common/vite`                            | `@unitifycom/ui/vite`                           |
| `@open-condo/ui/style-vars/css`                         | `@unitifycom/ui/style-vars/css`                 |
| `@open-condo/ui/dist/styles.min.css`                    | `@unitifycom/ui/styles.css`                     |
| `@unitifycom/ui-common/staff.css` / `resident.css`      | `@unitifycom/ui/staff.css` / `resident.css`     |
| `@unitifycom/ui-common/styles.css`                      | Удалить: включено в `@unitifycom/ui/styles.css` |

1. Удалите прежние зависимости icons/ui-common, source aliases и overrides на их архивы.
2. Установите один архив 0.2.0 по [инструкции](installation.md). Обновите lockfile.
3. Замените импорты по таблице. Публичные props компонентов сохранены; иконки доступны через `/icons`, чтобы избежать коллизий имён с UI-компонентами.
4. Подключите одну тему Ant Design перед `/styles.css`. Удалите повторные стили и исходную сборку Less, если она больше не нужна.
5. Оставьте один корневой провайдер. Не включайте React 19 из Modern Admin в дерево React 18.

Готовый CSS использует текущие токены Inter/Wix, префиксы `condo-` и `ant-`. Прежние Less-переопределения Pass не меняют готовый CSS: проверьте шрифты и при необходимости соберите собственную тему. Не редактируйте сгенерированные token snapshots вручную.

Телеметрия по умолчанию выключена. Если приложению нужны события Condo bridge, зарегистрируйте `setAnalyticsHandler` из `/events` и отправляйте только разрешённые данные на известный origin.

Перед выкладкой проверьте шрифты, формы, loading/disabled состояния, читаемость tooltip и тегов, таблицы и пагинацию, даты, RTL, пустые состояния и адаптивность. Сохраните закреплённую прежнюю версию для отката.
