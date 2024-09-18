-- Insert into Sports table
INSERT INTO Sports (name, createdAt, updatedAt) VALUES
('Combat Sports', NOW(), NOW()),
('Equestrian Sports', NOW(), NOW()),
('Extreme Sports', NOW(), NOW()),
('Individual Sports', NOW(), NOW()),
('Indoor Sports', NOW(), NOW()),
('Motorsports', NOW(), NOW()),
('Other Sports', NOW(), NOW()),
('Racquet Sports', NOW(), NOW()),
('Team Sports', NOW(), NOW()),
('Water Sports', NOW(), NOW()),
('Winter Sports', NOW(), NOW());

-- Insert into SportSubCategories table with corresponding sportId
INSERT INTO SportSubCategories (sportId, name, createdAt, updatedAt) VALUES
-- Combat Sports (sportId = 1)
(1, 'Fencing', NOW(), NOW()),
(1, 'Judo', NOW(), NOW()),
(1, 'Karate', NOW(), NOW()),
(1, 'Mixed Martial Arts (MMA)', NOW(), NOW()),
(1, 'Taekwondo', NOW(), NOW()),

-- Equestrian Sports (sportId = 2)
(2, 'Dressage', NOW(), NOW()),
(2, 'Eventing', NOW(), NOW()),
(2, 'Horse Racing', NOW(), NOW()),
(2, 'Polo', NOW(), NOW()),
(2, 'Show Jumping', NOW(), NOW()),

-- Extreme Sports (sportId = 3)
(3, 'BMX', NOW(), NOW()),
(3, 'Mountain Biking', NOW(), NOW()),
(3, 'Parkour', NOW(), NOW()),
(3, 'Rock Climbing', NOW(), NOW()),
(3, 'Skateboarding', NOW(), NOW()),
(3, 'Skydiving', NOW(), NOW()),

-- Individual Sports (sportId = 4)
(4, 'Athletics (Track and Field)', NOW(), NOW()),
(4, 'Badminton', NOW(), NOW()),
(4, 'Boxing', NOW(), NOW()),
(4, 'Cycling', NOW(), NOW()),
(4, 'Golf', NOW(), NOW()),
(4, 'Gymnastics', NOW(), NOW()),
(4, 'Martial Arts', NOW(), NOW()),
(4, 'Swimming', NOW(), NOW()),
(4, 'Tennis', NOW(), NOW()),
(4, 'Wrestling', NOW(), NOW()),

-- Indoor Sports (sportId = 5)
(5, 'Indoor Soccer (Futsal)', NOW(), NOW()),

-- Motorsports (sportId = 6)
(6, 'Drag Racing', NOW(), NOW()),
(6, 'Formula 1', NOW(), NOW()),
(6, 'IndyCar', NOW(), NOW()),
(6, 'MotoGP', NOW(), NOW()),
(6, 'NASCAR', NOW(), NOW()),
(6, 'Rally Racing', NOW(), NOW()),

-- Other Sports (sportId = 7)
(7, 'Archery', NOW(), NOW()),
(7, 'Chess', NOW(), NOW()),
(7, 'Esports', NOW(), NOW()),
(7, 'Shooting', NOW(), NOW()),

-- Racquet Sports (sportId = 8)
(8, 'Squash', NOW(), NOW()),
(8, 'Table Tennis', NOW(), NOW()),

-- Team Sports (sportId = 9)
(9, 'American Football', NOW(), NOW()),
(9, 'Baseball', NOW(), NOW()),
(9, 'Basketball', NOW(), NOW()),
(9, 'Cricket', NOW(), NOW()),
(9, 'Football (Soccer)', NOW(), NOW()),
(9, 'Handball', NOW(), NOW()),
(9, 'Hockey', NOW(), NOW()),
(9, 'Rugby', NOW(), NOW()),
(9, 'Volleyball', NOW(), NOW()),
(9, 'Water Polo', NOW(), NOW()),

-- Water Sports (sportId = 10)
(10, 'Diving', NOW(), NOW()),
(10, 'Kayaking', NOW(), NOW()),
(10, 'Rowing', NOW(), NOW()),
(10, 'Sailing', NOW(), NOW()),
(10, 'Surfing', NOW(), NOW()),

-- Winter Sports (sportId = 11)
(11, 'Bobsleigh', NOW(), NOW()),
(11, 'Curling', NOW(), NOW()),
(11, 'Figure Skating', NOW(), NOW()),
(11, 'Ice Hockey', NOW(), NOW()),
(11, 'Luge', NOW(), NOW()),
(11, 'Skiing', NOW(), NOW()),
(11, 'Snowboarding', NOW(), NOW()),
(11, 'Speed Skating', NOW(), NOW());
