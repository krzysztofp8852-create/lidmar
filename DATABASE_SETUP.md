# Konfiguracja bazy danych Neon

## Krok 1: Utworzenie bazy danych

1. Przejdź do [Neon Console](https://console.neon.tech)
2. Utwórz nowy projekt
3. Skopiuj connection string z sekcji "Connection Details"

## Krok 2: Konfiguracja zmiennych środowiskowych

Utwórz plik `.env.local` w katalogu głównym projektu:

```env
# Database
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# NextAuth (wygeneruj secret: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

Zastąp `username`, `password`, `host` i `database` wartościami z Neon Console.

## Krok 3: Instalacja zależności

```bash
npm install
```

## Krok 4: Uruchomienie migracji

Wykonaj **obie** migracje w Neon SQL Editor:

1. `lib/migrations.sql` - tabele products i site_content
2. `lib/migrations-auth.sql` - tabele users i pages (autoryzacja)

```bash
psql $DATABASE_URL -f lib/migrations.sql
psql $DATABASE_URL -f lib/migrations-auth.sql
```

Lub skopiuj SQL bezpośrednio do Neon SQL Editor w konsoli.

## Krok 5: Weryfikacja

Uruchom aplikację:

```bash
npm run dev
```

Aplikacja automatycznie użyje bazy danych do przechowywania produktów i treści strony.

## Funkcjonalność

- **Produkty**: Zarządzane przez API `/api/products`
- **Treść strony**: Zarządzana przez API `/api/content`
- **Strony użytkowników**: Zarządzane przez API `/api/pages/[id]`
- **Fallback**: Aplikacja automatycznie korzysta z localStorage jeśli API nie jest dostępne

## Autoryzacja (NextAuth)

Panel administratora używa NextAuth do bezpiecznej autoryzacji.

### Domyślne dane logowania:
- **Email**: admin@lidmar.pl
- **Hasło**: admin123

⚠️ **WAŻNE**: Zmień te dane w produkcji!

### Dostęp do panelu:
- Panel admina: `/admin`
- Logowanie: `/admin/login`
- Edycja stron: `/pages/[id]/edit` (tylko dla właściciela)

## Migracja z localStorage

Istniejące dane z localStorage będą automatycznie synchronizowane z bazą danych przy pierwszym zapisie przez panel administratora.
