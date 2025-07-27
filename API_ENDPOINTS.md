# Word Project Backend API Documentation

## Base URL

```
http://localhost:4000
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/login

User login endpoint.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "profile_image": "https://example.com/image.jpg",
    "is_premium": false,
    "current_level": 1,
    "xp": 0,
    "coins": 0,
    "streak": 0,
    "isActive": true,
    "role": "user",
    "last_login": "2024-01-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### POST /auth/register

User registration endpoint.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "Password123",
  "username": "username"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "profile_image": null,
    "is_premium": false,
    "current_level": 1,
    "xp": 0,
    "coins": 0,
    "streak": 0,
    "isActive": true,
    "role": "user",
    "last_login": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  },
  "token": "jwt_token_here"
}
```

### POST /auth/forgot-password

Request password reset email.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "Password reset email sent successfully"
}
```

### POST /auth/reset-password

Reset password with token.

**Request Body:**

```json
{
  "token": "reset_token_here",
  "password": "NewPassword123"
}
```

**Response:**

```json
{
  "message": "Password reset successfully"
}
```

---

## 👥 User Endpoints

### GET /users

Get all users (Admin only).

**Response:**

```json
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "profile_image": "https://example.com/image.jpg",
    "is_premium": false,
    "current_level": 1,
    "xp": 0,
    "coins": 0,
    "streak": 0,
    "isActive": true,
    "role": "user",
    "last_login": "2024-01-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 🌍 Language Endpoints

### GET /languages

Get all available languages.

**Response:**

```json
[
  {
    "id": "uuid",
    "code": "en",
    "name": "English"
  },
  {
    "id": "uuid",
    "code": "de",
    "name": "German"
  }
]
```

### GET /languages/:id

Get specific language details.

**Response:**

```json
{
  "id": "uuid",
  "code": "en",
  "name": "English"
}
```

---

## 📚 Word Endpoints

### GET /words

Get words with pagination and filters.

**Query Parameters:**

- `language_id` (string): Filter by language
- `level` (number): Filter by CEFR level (A1-C2)
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**

```json
{
  "words": [
    {
      "id": "uuid",
      "word": "hello",
      "meaning": "A greeting",
      "level": 1,
      "language_id": "uuid",
      "part_of_speech": "interjection",
      "example_sentences": [
        {
          "id": "uuid",
          "sentence": "Hello, how are you?",
          "translation": "Merhaba, nasılsın?"
        }
      ]
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

### GET /words/:id

Get specific word details.

**Response:**

```json
{
  "id": "uuid",
  "word": "hello",
  "meaning": "A greeting",
  "level": 1,
  "language_id": "uuid",
  "part_of_speech": "interjection",
  "example_sentences": [
    {
      "id": "uuid",
      "sentence": "Hello, how are you?",
      "translation": "Merhaba, nasılsın?"
    }
  ],
  "ai_questions": [
    {
      "id": "uuid",
      "sentence": "Complete the sentence: ___ world!",
      "correct_answer": "Hello",
      "wrong_options": "Goodbye,Thanks,Please",
      "difficulty": 1
    }
  ]
}
```

---

## 👤 User Language Endpoints

### GET /user-languages

Get user's language progress.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "language_id": "uuid",
    "current_level": 2,
    "xp": 150,
    "streak": 5,
    "created_at": "2024-01-01T00:00:00.000Z",
    "language": {
      "id": "uuid",
      "code": "en",
      "name": "English"
    }
  }
]
```

### POST /user-languages

Add a new language for user.

**Request Body:**

```json
{
  "language_id": "uuid"
}
```

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "language_id": "uuid",
  "current_level": 1,
  "xp": 0,
  "streak": 0,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 📝 User Words Endpoints

### GET /user-words

Get user's custom words.

**Query Parameters:**

- `language_id` (string): Filter by language
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**

```json
{
  "words": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "word": "custom_word",
      "meaning": "Custom meaning",
      "level": 2,
      "language_id": "uuid",
      "source": "manual",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### POST /user-words

Add a custom word.

**Request Body:**

```json
{
  "word": "custom_word",
  "meaning": "Custom meaning",
  "level": 2,
  "language_id": "uuid",
  "source": "manual"
}
```

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "word": "custom_word",
  "meaning": "Custom meaning",
  "level": 2,
  "language_id": "uuid",
  "source": "manual",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 🎯 Placement Test Endpoints

### GET /placement-tests

Get user's placement test history.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "result_level": 3,
    "total_correct": 8,
    "total_questions": 10,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /placement-tests

Submit placement test results.

**Request Body:**

```json
{
  "result_level": 3,
  "total_correct": 8,
  "total_questions": 10
}
```

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "result_level": 3,
  "total_correct": 8,
  "total_questions": 10,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 📋 Training Plan Endpoints

### GET /training-plans

Get user's training plans.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Daily Practice",
    "type": "daily",
    "total_words": 20,
    "target_minutes": 15,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /training-plans

Create a new training plan.

**Request Body:**

```json
{
  "name": "Daily Practice",
  "type": "daily",
  "total_words": 20,
  "target_minutes": 15
}
```

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "name": "Daily Practice",
  "type": "daily",
  "total_words": 20,
  "target_minutes": 15,
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 🏃 Training Session Endpoints

### GET /training-sessions

Get user's training sessions.

**Query Parameters:**

- `plan_id` (string): Filter by training plan
- `date` (string): Filter by date (YYYY-MM-DD)

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "plan_id": "uuid",
    "completed_words": 18,
    "duration_minutes": 12,
    "xp_earned": 150,
    "coins_earned": 10,
    "date": "2024-01-01"
  }
]
```

### POST /training-sessions

Submit training session results.

**Request Body:**

```json
{
  "plan_id": "uuid",
  "completed_words": 18,
  "duration_minutes": 12,
  "xp_earned": 150,
  "coins_earned": 10,
  "date": "2024-01-01"
}
```

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "plan_id": "uuid",
  "completed_words": 18,
  "duration_minutes": 12,
  "xp_earned": 150,
  "coins_earned": 10,
  "date": "2024-01-01"
}
```

---

## 🏆 Achievement Endpoints

### GET /achievements

Get all available achievements.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "First Steps",
    "description": "Complete your first training session",
    "level": 1,
    "icon": "first-steps.png"
  }
]
```

### GET /user-achievements

Get user's earned achievements.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "achievement_id": "uuid",
    "earned_at": "2024-01-01T00:00:00.000Z",
    "achievement": {
      "id": "uuid",
      "name": "First Steps",
      "description": "Complete your first training session",
      "level": 1,
      "icon": "first-steps.png"
    }
  }
]
```

---

## 🎯 Mission Endpoints

### GET /missions

Get all available missions.

**Query Parameters:**

- `type` (string): Filter by type (daily, weekly, ai)

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "Daily Practice",
    "description": "Complete 20 words today",
    "type": "daily",
    "xp_reward": 100,
    "coin_reward": 5
  }
]
```

### GET /user-missions

Get user's mission progress.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "mission_id": "uuid",
    "is_completed": false,
    "completed_at": null,
    "mission": {
      "id": "uuid",
      "title": "Daily Practice",
      "description": "Complete 20 words today",
      "type": "daily",
      "xp_reward": 100,
      "coin_reward": 5
    }
  }
]
```

### POST /user-missions/:id/complete

Mark mission as completed.

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "mission_id": "uuid",
  "is_completed": true,
  "completed_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 🛒 Store Endpoints

### GET /store-items

Get all store items.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "XP Booster",
    "description": "Double XP for 1 hour",
    "type": "booster",
    "coin_cost": 50
  }
]
```

### GET /user-store-items

Get user's purchased items.

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "store_item_id": "uuid",
    "acquired_at": "2024-01-01T00:00:00.000Z",
    "is_active": true,
    "store_item": {
      "id": "uuid",
      "name": "XP Booster",
      "description": "Double XP for 1 hour",
      "type": "booster",
      "coin_cost": 50
    }
  }
]
```

### POST /store-items/:id/purchase

Purchase a store item.

**Response:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "store_item_id": "uuid",
  "acquired_at": "2024-01-01T00:00:00.000Z",
  "is_active": true
}
```

---

## 🏅 League Endpoints

### GET /leagues

Get all leagues.

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Bronze",
    "min_level": 1,
    "max_level": 10
  }
]
```

### GET /league-entries

Get user's league entries.

**Query Parameters:**

- `week_start` (string): Filter by week (YYYY-MM-DD)

**Response:**

```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "league_id": "uuid",
    "week_start": "2024-01-01",
    "total_xp": 500,
    "rank": 5,
    "league": {
      "id": "uuid",
      "name": "Bronze",
      "min_level": 1,
      "max_level": 10
    }
  }
]
```

### GET /league-entries/:league_id/leaderboard

Get league leaderboard.

**Response:**

```json
[
  {
    "rank": 1,
    "user": {
      "id": "uuid",
      "username": "top_user",
      "profile_image": "https://example.com/image.jpg"
    },
    "total_xp": 1000
  }
]
```

---

## 👥 Follow Endpoints

### GET /follows/followers

Get user's followers.

**Response:**

```json
[
  {
    "id": "uuid",
    "follower_id": "uuid",
    "following_id": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z",
    "follower": {
      "id": "uuid",
      "username": "follower_user",
      "profile_image": "https://example.com/image.jpg"
    }
  }
]
```

### GET /follows/following

Get users that the current user follows.

**Response:**

```json
[
  {
    "id": "uuid",
    "follower_id": "uuid",
    "following_id": "uuid",
    "created_at": "2024-01-01T00:00:00.000Z",
    "following": {
      "id": "uuid",
      "username": "following_user",
      "profile_image": "https://example.com/image.jpg"
    }
  }
]
```

### POST /follows/:user_id

Follow a user.

**Response:**

```json
{
  "id": "uuid",
  "follower_id": "uuid",
  "following_id": "uuid",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /follows/:user_id

Unfollow a user.

**Response:**

```json
{
  "message": "Unfollowed successfully"
}
```

---

## 🎮 Game Room Endpoints

### GET /game-rooms

Get available game rooms.

**Query Parameters:**

- `language_id` (string): Filter by language
- `level` (number): Filter by level
- `status` (string): Filter by status (waiting, active, finished)

**Response:**

```json
[
  {
    "id": "uuid",
    "host_user_id": "uuid",
    "language_id": "uuid",
    "level": 2,
    "status": "waiting",
    "created_at": "2024-01-01T00:00:00.000Z",
    "host_user": {
      "id": "uuid",
      "username": "host_user",
      "profile_image": "https://example.com/image.jpg"
    },
    "language": {
      "id": "uuid",
      "code": "en",
      "name": "English"
    }
  }
]
```

### POST /game-rooms

Create a new game room.

**Request Body:**

```json
{
  "language_id": "uuid",
  "level": 2
}
```

**Response:**

```json
{
  "id": "uuid",
  "host_user_id": "uuid",
  "language_id": "uuid",
  "level": 2,
  "status": "waiting",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

### POST /game-rooms/:id/join

Join a game room.

**Response:**

```json
{
  "id": "uuid",
  "room_id": "uuid",
  "user_id": "uuid",
  "score": 0,
  "joined_at": "2024-01-01T00:00:00.000Z"
}
```

### GET /game-rooms/:id

Get game room details.

**Response:**

```json
{
  "id": "uuid",
  "host_user_id": "uuid",
  "language_id": "uuid",
  "level": 2,
  "status": "active",
  "created_at": "2024-01-01T00:00:00.000Z",
  "host_user": {
    "id": "uuid",
    "username": "host_user",
    "profile_image": "https://example.com/image.jpg"
  },
  "language": {
    "id": "uuid",
    "code": "en",
    "name": "English"
  },
  "game_room_users": [
    {
      "id": "uuid",
      "room_id": "uuid",
      "user_id": "uuid",
      "score": 150,
      "joined_at": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": "uuid",
        "username": "player1",
        "profile_image": "https://example.com/image.jpg"
      }
    }
  ]
}
```

---

## 🤖 AI Question Endpoints

### GET /ai-questions

Get AI-generated questions.

**Query Parameters:**

- `word_id` (string): Filter by word
- `difficulty` (number): Filter by difficulty level

**Response:**

```json
[
  {
    "id": "uuid",
    "word_id": "uuid",
    "sentence": "Complete the sentence: ___ world!",
    "correct_answer": "Hello",
    "wrong_options": "Goodbye,Thanks,Please",
    "difficulty": 1
  }
]
```

---

## 📊 Profile Endpoints

### GET /profile

Get current user's profile.

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "profile_image": "https://example.com/image.jpg",
  "is_premium": false,
  "current_level": 5,
  "xp": 1250,
  "coins": 100,
  "streak": 7,
  "isActive": true,
  "role": "user",
  "last_login": "2024-01-01T00:00:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### PUT /profile

Update user profile.

**Request Body:**

```json
{
  "username": "new_username",
  "profile_image": "https://example.com/new-image.jpg"
}
```

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "new_username",
  "profile_image": "https://example.com/new-image.jpg",
  "is_premium": false,
  "current_level": 5,
  "xp": 1250,
  "coins": 100,
  "streak": 7,
  "isActive": true,
  "role": "user",
  "last_login": "2024-01-01T00:00:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

---

## 📈 Statistics Endpoints

### GET /statistics

Get user's learning statistics.

**Response:**

```json
{
  "total_words_learned": 150,
  "total_xp_earned": 2500,
  "total_coins_earned": 200,
  "current_streak": 7,
  "longest_streak": 15,
  "total_training_sessions": 45,
  "total_training_minutes": 675,
  "achievements_earned": 8,
  "missions_completed": 25,
  "languages_learning": 3
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["Validation error message"],
  "error": "Bad Request"
}
```

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Data Models

### User Model

```typescript
{
  id: string;
  email: string;
  username: string;
  password: string;
  profile_image?: string;
  is_premium: boolean;
  current_level: number;
  xp: number;
  coins: number;
  streak: number;
  isActive: boolean;
  role: string;
  last_login?: Date;
  reset_token?: string;
  reset_token_expiration?: Date;
  created_at: Date;
  updated_at: Date;
}
```

### Language Model

```typescript
{
  id: string;
  code: string;
  name: string;
}
```

### Word Model

```typescript
{
  id: string;
  word: string;
  meaning: string;
  level: number;
  language_id: string;
  part_of_speech: string;
}
```

### Training Plan Model

```typescript
{
  id: string;
  user_id: string;
  name: string;
  type: string;
  total_words: number;
  target_minutes: number;
  created_at: Date;
}
```

### Achievement Model

```typescript
{
  id: string;
  name: string;
  description: string;
  level: number;
  icon: string;
}
```

### Game Room Model

```typescript
{
  id: string;
  host_user_id: string;
  language_id: string;
  level: number;
  status: string;
  created_at: Date;
}
```

---

## Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all IDs
- Pagination is supported for list endpoints
- Filtering and sorting options are available for most endpoints
- File uploads for profile images should use multipart/form-data
- WebSocket connections may be used for real-time game room updates
- Rate limiting is applied to prevent abuse
- CORS is enabled for cross-origin requests
