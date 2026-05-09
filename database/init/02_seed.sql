-- ============================================================
--  WeConnect – Seed Data (dữ liệu mẫu)
--  File: 02_seed.sql
-- ============================================================

SET NAMES utf8mb4;

USE weconnect;

-- ── 1. HOBBIES ───────────────────────────────────────────────
INSERT INTO HOBBIES (name, category) VALUES
('Anime',          'Giải trí'),
('Manga',          'Giải trí'),
('Gaming',         'Giải trí'),
('Phim ảnh',       'Giải trí'),
('Âm nhạc',        'Nghệ thuật'),
('Nhiếp ảnh',      'Nghệ thuật'),
('Vẽ tranh',       'Nghệ thuật'),
('Nấu ăn',         'Ẩm thực'),
('Du lịch',        'Khám phá'),
('Đọc sách',       'Học thuật'),
('Thể thao',       'Sức khoẻ'),
('Yoga',           'Sức khoẻ'),
('Tiếng Nhật',     'Ngôn ngữ'),
('Tiếng Anh',      'Ngôn ngữ'),
('Công nghệ',      'Kỹ thuật');

-- ── 2. USERS ─────────────────────────────────────────────────
-- password_hash = bcrypt('Password@123')
INSERT INTO USERS (email, phone_number, password_hash, full_name, date_of_birth, gender,
                   avatar_url, bio, location, japanese_level, preferred_language, role, is_verified) VALUES
-- Role 1 – Người muốn kết bạn
('nguyen.tuan@gmail.com',   '0901111001', '$2b$12$M9zaNuf1FQMP7p3Z9cxO5.ZuyVzY.9wGctQMKxq9T044MyYdYlMsq',
 'Nguyễn Tuấn',   '1999-03-15', 'MALE',
 'https://storage.weconnect.vn/avatars/nguyen_tuan.jpg',
 'Mình đang học tiếng Nhật N3, muốn tìm bạn cùng luyện nói.',
 'Hà Nội', 'N3', 'vi', 'USER', TRUE),

('tran.linh@gmail.com',     '0901111002', '$2b$12$M9zaNuf1FQMP7p3Z9cxO5.ZuyVzY.9wGctQMKxq9T044MyYdYlMsq',
 'Trần Thị Linh', '2000-07-22', 'FEMALE',
 'https://storage.weconnect.vn/avatars/tran_linh.jpg',
 'Yêu thích anime và văn hoá Nhật Bản, đang học N4.',
 'TP.HCM', 'N4', 'vi', 'USER', TRUE),

('pham.anh@gmail.com',      '0901111003', '$2b$12$M9zaNuf1FQMP7p3Z9cxO5.ZuyVzY.9wGctQMKxq9T044MyYdYlMsq',
 'Phạm Minh Anh', '1998-11-08', 'MALE',
 'https://storage.weconnect.vn/avatars/pham_anh.jpg',
 'Kỹ sư phần mềm, muốn giao lưu văn hoá Nhật-Việt.',
 'Đà Nẵng', 'N2', 'vi', 'USER', TRUE),

('le.mai@gmail.com',        '0901111004', '$2b$12$M9zaNuf1FQMP7p3Z9cxO5.ZuyVzY.9wGctQMKxq9T044MyYdYlMsq',
 'Lê Thị Mai',    '2001-05-30', 'FEMALE',
 'https://storage.weconnect.vn/avatars/le_mai.jpg',
 'Sinh viên đại học, thích du lịch và nấu ăn.',
 'Hà Nội', 'N5', 'vi', 'USER', FALSE),

('hoang.duc@gmail.com',     '0901111005', '$2b$12$M9zaNuf1FQMP7p3Z9cxO5.ZuyVzY.9wGctQMKxq9T044MyYdYlMsq',
 'Hoàng Đức',     '1997-09-18', 'MALE',
 'https://storage.weconnect.vn/avatars/hoang_duc.jpg',
 'Làm việc tại Tokyo 2 năm, muốn giữ kết nối với cộng đồng Việt.',
 'Tokyo', 'N1', 'vi', 'USER', TRUE),

-- Role 2 – Người tổ chức sự kiện
('organizer.han@weconnect.vn', '0902000001', '$2b$12$M9zaNuf1FQMP7p3Z9cxO5.ZuyVzY.9wGctQMKxq9T044MyYdYlMsq',
 'Hà Nguyễn (CLB Nhật-Việt)', '1990-01-10', 'FEMALE',
 'https://storage.weconnect.vn/avatars/organizer_han.jpg',
 'Chủ nhiệm CLB Giao lưu Nhật-Việt tại Hà Nội.',
 'Hà Nội', 'N1', 'vi', 'ORGANIZER', TRUE),

('organizer.minh@weconnect.vn', '0902000002', '$2b$12$M9zaNuf1FQMP7p3Z9cxO5.ZuyVzY.9wGctQMKxq9T044MyYdYlMsq',
 'Minh Trần (JVLink HCM)',    '1988-06-25', 'MALE',
 'https://storage.weconnect.vn/avatars/organizer_minh.jpg',
 'Tổ chức các sự kiện kết nối người Nhật và người Việt tại TP.HCM.',
 'TP.HCM', 'N2', 'ja', 'ORGANIZER', TRUE);

-- ── 3. USER_HOBBIES ──────────────────────────────────────────
INSERT INTO USER_HOBBIES (user_id, hobby_id) VALUES
-- Nguyễn Tuấn: Anime, Gaming, Tiếng Nhật, Công nghệ
(1, 1), (1, 3), (1, 13), (1, 15),
-- Trần Linh: Anime, Manga, Âm nhạc, Tiếng Nhật
(2, 1), (2, 2), (2, 5), (2, 13),
-- Phạm Anh: Công nghệ, Đọc sách, Thể thao, Tiếng Nhật
(3, 15), (3, 10), (3, 11), (3, 13),
-- Lê Mai: Du lịch, Nấu ăn, Nhiếp ảnh, Vẽ tranh
(4, 9), (4, 8), (4, 6), (4, 7),
-- Hoàng Đức: Du lịch, Tiếng Nhật, Âm nhạc, Phim ảnh
(5, 9), (5, 13), (5, 5), (5, 4);

-- ── 4. FRIEND_REQUESTS ───────────────────────────────────────
INSERT INTO FRIEND_REQUESTS (sender_id, receiver_id, status, created_at, responded_at) VALUES
(1, 2, 'ACCEPTED',  '2024-11-01 09:00:00', '2024-11-01 10:30:00'),
(1, 3, 'ACCEPTED',  '2024-11-02 14:00:00', '2024-11-02 15:00:00'),
(2, 3, 'ACCEPTED',  '2024-11-03 11:00:00', '2024-11-03 12:00:00'),
(4, 1, 'PENDING',   '2024-11-10 08:00:00', NULL),
(4, 2, 'REJECTED',  '2024-11-10 08:05:00', '2024-11-10 20:00:00'),
(5, 1, 'ACCEPTED',  '2024-11-05 16:00:00', '2024-11-05 17:00:00'),
(3, 5, 'PENDING',   '2024-11-11 09:30:00', NULL);

-- ── 5. FRIENDSHIPS ───────────────────────────────────────────
-- user1_id < user2_id (theo constraint)
INSERT INTO FRIENDSHIPS (user1_id, user2_id, created_at) VALUES
(1, 2, '2024-11-01 10:30:00'),
(1, 3, '2024-11-02 15:00:00'),
(2, 3, '2024-11-03 12:00:00'),
(1, 5, '2024-11-05 17:00:00');

-- ── 6. CONVERSATIONS ─────────────────────────────────────────
INSERT INTO CONVERSATIONS (user1_id, user2_id, last_message_at, created_at) VALUES
(1, 2, '2024-11-15 21:05:00', '2024-11-01 10:31:00'),
(1, 3, '2024-11-16 08:30:00', '2024-11-02 15:01:00'),
(2, 3, '2024-11-14 19:00:00', '2024-11-03 12:01:00'),
(1, 5, '2024-11-17 22:00:00', '2024-11-05 17:01:00');

-- ── 7. MESSAGES ──────────────────────────────────────────────
-- conversation 1: Tuấn ↔ Linh
INSERT INTO MESSAGES (conversation_id, sender_id, content, message_type, translated_content, created_at, is_read) VALUES
(1, 1, 'Chào Linh! Mình là Tuấn, mình thấy bạn cũng thích anime nhỉ?', 'TEXT', NULL, '2024-11-01 10:35:00', TRUE),
(1, 2, 'Chào Tuấn! Đúng rồi, mình đang xem Jujutsu Kaisen nè, bạn thích anime nào?', 'TEXT', NULL, '2024-11-01 10:40:00', TRUE),
(1, 1, 'Mình thích Demon Slayer và Attack on Titan. Bạn đang học N4 à? Mình học N3 rồi, mình có thể luyện cùng không?', 'TEXT', NULL, '2024-11-01 10:45:00', TRUE),
(1, 2, 'Tuyệt vời! Mình muốn lắm. こんにちは！よろしくお願いします！', 'TEXT', 'Xin chào! Rất vui được làm quen!', '2024-11-01 10:50:00', TRUE),
(1, 1, 'よろしくお願いします！今日も日本語を練習しましょう！', 'TEXT', 'Rất vui được làm quen! Hôm nay mình cũng cùng luyện tiếng Nhật nhé!', '2024-11-15 21:00:00', TRUE),
(1, 2, '楽しみにしています！', 'TEXT', 'Mình rất mong chờ đó!', '2024-11-15 21:05:00', FALSE),

-- conversation 2: Tuấn ↔ Anh
(2, 1, 'Anh ơi, bạn đang làm ở công ty nào vậy? Mình cũng muốn theo ngành IT.', 'TEXT', NULL, '2024-11-02 15:05:00', TRUE),
(2, 3, 'Mình đang làm backend developer. Bạn học ngành gì?', 'TEXT', NULL, '2024-11-02 15:10:00', TRUE),
(2, 1, 'Mình học CNTT năm 3 rồi, đang muốn thực tập. Bạn có tips gì không?', 'TEXT', NULL, '2024-11-16 08:00:00', TRUE),
(2, 3, 'Cố gắng build portfolio trước nhé! Mình có thể review cho bạn.', 'TEXT', NULL, '2024-11-16 08:30:00', FALSE),

-- conversation 3: Linh ↔ Anh
(3, 2, 'Phạm Anh ơi, bạn có biết chỗ nào dạy tiếng Nhật tốt ở Đà Nẵng không?', 'TEXT', NULL, '2024-11-03 12:05:00', TRUE),
(3, 3, 'Mình từng học ở Trung tâm Nhật ngữ Sakura, khá tốt đó bạn.', 'TEXT', NULL, '2024-11-14 19:00:00', TRUE),

-- conversation 4: Tuấn ↔ Hoàng Đức
(4, 5, '東京はどうですか？仕事は忙しいですか？', 'TEXT', 'Tokyo thế nào? Công việc có bận không?', '2024-11-05 17:05:00', TRUE),
(4, 1, '東京はとても楽しいです！でも、ベトナムの食べ物が恋しいです。', 'TEXT', 'Tokyo rất vui! Nhưng mình nhớ đồ ăn Việt Nam lắm.', '2024-11-17 22:00:00', FALSE);

-- ── 8. CALLS ─────────────────────────────────────────────────
INSERT INTO CALLS (caller_id, receiver_id, call_type, status, start_time, end_time) VALUES
(1, 2, 'AUDIO', 'ACCEPTED', '2024-11-10 20:00:00', '2024-11-10 20:35:00'),
(1, 3, 'VIDEO', 'ACCEPTED', '2024-11-12 21:00:00', '2024-11-12 21:20:00'),
(2, 3, 'AUDIO', 'MISSED',   '2024-11-13 18:00:00', NULL),
(5, 1, 'VIDEO', 'ACCEPTED', '2024-11-15 10:00:00', '2024-11-15 10:45:00'),
(4, 1, 'AUDIO', 'REJECTED', '2024-11-11 09:00:00', NULL);

-- ── 9. EVENTS ────────────────────────────────────────────────
INSERT INTO EVENTS (organizer_id, title, description, start_time, end_time, location, capacity, image_url, status) VALUES
(6, 'Giao lưu Nhật-Việt: Buổi nói chuyện tự do',
 'Sự kiện giao lưu dành cho người học tiếng Nhật và người Nhật muốn học tiếng Việt. Cùng trò chuyện, chia sẻ văn hoá và kết bạn mới nhé!',
 '2024-12-07 14:00:00', '2024-12-07 17:00:00',
 'Cà phê Nhật Bản – 15 Tràng Tiền, Hoàn Kiếm, Hà Nội',
 30, 'https://storage.weconnect.vn/events/event_hanoi_1.jpg', 'ENDED'),

(7, 'Hội ngộ cộng đồng WeConnect TP.HCM',
 'Buổi gặp mặt offline đầu tiên của cộng đồng WeConnect khu vực TP.HCM. Có minigame, quà tặng và nhiều hoạt động thú vị!',
 '2024-12-15 09:00:00', '2024-12-15 12:00:00',
 'Beta Café – 78 Lê Lợi, Quận 1, TP.HCM',
 50, 'https://storage.weconnect.vn/events/event_hcm_1.jpg', 'ENDED'),

(6, 'Workshop: Học tiếng Nhật qua Anime',
 'Workshop thực hành: học từ vựng và ngữ pháp tiếng Nhật thông qua các đoạn phim anime yêu thích. Phù hợp trình độ N5-N3.',
 '2025-01-18 09:00:00', '2025-01-18 11:30:00',
 'Toà nhà FPT – 17 Duy Tân, Cầu Giấy, Hà Nội',
 25, 'https://storage.weconnect.vn/events/event_anime_ws.jpg', 'UPCOMING'),

(7, 'Tiệc Tết cùng bạn Nhật: Văn hoá đón năm mới',
 'Chia sẻ phong tục đón năm mới của người Nhật và người Việt. Cùng làm bánh chưng và viết thư đầu năm (nengajou)!',
 '2025-01-25 14:00:00', '2025-01-25 18:00:00',
 'Trung tâm văn hoá Nhật Bản – 27 Quang Trung, TP.HCM',
 40, 'https://storage.weconnect.vn/events/event_tet.jpg', 'UPCOMING');

-- ── 10. EVENT_REGISTRATIONS ──────────────────────────────────
INSERT INTO EVENT_REGISTRATIONS (event_id, user_id, registered_at) VALUES
-- Event 1 (Hà Nội)
(1, 1, '2024-11-20 09:00:00'),
(1, 3, '2024-11-21 14:00:00'),
(1, 4, '2024-11-22 10:00:00'),
-- Event 2 (HCM)
(2, 2, '2024-11-25 11:00:00'),
(2, 3, '2024-11-25 12:00:00'),
(2, 5, '2024-11-26 08:00:00'),
-- Event 3 (Workshop)
(3, 1, '2024-12-01 09:30:00'),
(3, 2, '2024-12-01 10:00:00'),
(3, 4, '2024-12-02 14:00:00'),
-- Event 4 (Tết)
(4, 1, '2024-12-10 10:00:00'),
(4, 2, '2024-12-10 10:30:00'),
(4, 5, '2024-12-11 09:00:00');

-- ── 11. EVENT_FEEDBACK ───────────────────────────────────────
-- Chỉ feedback cho event đã kết thúc (1 và 2)
INSERT INTO EVENT_FEEDBACK (event_id, user_id, rating, comment, created_at) VALUES
(1, 1, 5, 'Sự kiện rất hay! Mình đã kết bạn được với nhiều người học tiếng Nhật. Mong có thêm nhiều buổi như thế này.', '2024-12-07 18:00:00'),
(1, 3, 4, 'Tổ chức tốt, chỉ tiếc là thời gian hơi ngắn. Lần sau nên tăng thêm 1-2 tiếng.', '2024-12-07 18:30:00'),
(1, 4, 5, 'Tuyệt vời! Mình rất shyビ lúc đầu nhưng mọi người rất thân thiện.', '2024-12-08 09:00:00'),
(2, 2, 5, 'Minigame rất thú vị, quà tặng xinh! Ban tổ chức rất chuyên nghiệp.', '2024-12-15 13:00:00'),
(2, 3, 4, 'Địa điểm hơi chật khi đông người, nhưng nội dung rất hay.', '2024-12-15 13:30:00'),
(2, 5, 5, 'Gặp được nhiều người Việt cùng sống ở Nhật, cảm giác ấm lòng lắm!', '2024-12-15 14:00:00');

-- ── 12. GAME_ROOMS ───────────────────────────────────────────
INSERT INTO GAME_ROOMS (code, host_id, room_type, max_players, status, created_at) VALUES
('WCTUAN1',  1, 'QUIZ',    8,  'ENDED',   '2024-11-20 20:00:00'),
('WCLINH2',  2, 'TRIVIA',  6,  'ENDED',   '2024-11-22 21:00:00'),
('WCABC99',  3, 'QUIZ',    10, 'WAITING', '2024-11-28 19:00:00'),
('WCDUC55',  5, 'CUSTOM',  4,  'PLAYING', '2024-11-28 20:00:00');

-- ── 13. GAME_PARTICIPANTS ────────────────────────────────────
INSERT INTO GAME_PARTICIPANTS (room_id, user_id, joined_at, left_at) VALUES
-- Room 1 (ENDED)
(1, 1, '2024-11-20 20:00:00', '2024-11-20 21:00:00'),
(1, 2, '2024-11-20 20:02:00', '2024-11-20 21:00:00'),
(1, 3, '2024-11-20 20:05:00', '2024-11-20 21:00:00'),
-- Room 2 (ENDED)
(2, 2, '2024-11-22 21:00:00', '2024-11-22 21:45:00'),
(2, 4, '2024-11-22 21:03:00', '2024-11-22 21:45:00'),
-- Room 3 (WAITING)
(3, 3, '2024-11-28 19:00:00', NULL),
(3, 1, '2024-11-28 19:10:00', NULL),
-- Room 4 (PLAYING)
(4, 5, '2024-11-28 20:00:00', NULL),
(4, 1, '2024-11-28 20:05:00', NULL);

-- ── 14. GAME_MESSAGES ────────────────────────────────────────
INSERT INTO GAME_MESSAGES (room_id, sender_id, content, created_at) VALUES
-- Room 1
(1, 1, 'Chào mọi người! Bắt đầu game nào 🎮',            '2024-11-20 20:01:00'),
(1, 2, 'Sẵn sàng! Chủ đề hôm nay là gì vậy?',            '2024-11-20 20:01:30'),
(1, 3, 'Mình chọn chủ đề Văn hoá Nhật Bản!',              '2024-11-20 20:02:00'),
(1, 1, 'OK! Câu hỏi 1: "Sakura" có nghĩa là gì?',         '2024-11-20 20:05:00'),
(1, 2, 'Hoa anh đào!',                                    '2024-11-20 20:05:10'),
(1, 1, '正解！Linh trả lời đúng!',                        '2024-11-20 20:05:20'),
-- Room 4
(4, 5, 'Mọi người sẵn sàng chưa? Mình ở Tokyo nên lag hơi xíu 😅', '2024-11-28 20:01:00'),
(4, 1, 'Không sao Đức ơi! Bắt đầu thôi!',                '2024-11-28 20:01:30');

-- ── 15. OTPS ─────────────────────────────────────────────────
INSERT INTO OTPS (identifier, code, purpose, expire_at, used, created_at) VALUES
-- OTP đã dùng (register Lê Mai)
('le.mai@gmail.com',   '482910', 'REGISTER',        '2024-10-15 10:05:00', TRUE,  '2024-10-15 10:00:00'),
-- OTP đã dùng (forgot password Trần Linh)
('tran.linh@gmail.com','739201', 'FORGOT_PASSWORD',  '2024-11-05 14:05:00', TRUE,  '2024-11-05 14:00:00'),
-- OTP còn hiệu lực (chưa dùng – dùng để test)
('test.user@gmail.com','123456', 'REGISTER',        '2099-12-31 23:59:59', FALSE, NOW());
