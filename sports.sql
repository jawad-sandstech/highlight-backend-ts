-- Insert into Sports table
INSERT INTO Sports (name) VALUES
('Combat Sports'),
('Equestrian Sports'),
('Extreme Sports'),
('Individual Sports'),
('Indoor Sports'),
('Motorsports'),
('Other Sports'),
('Racquet Sports'),
('Team Sports'),
('Water Sports'),
('Winter Sports');

-- Insert into SportSubCategories table with corresponding sportId
INSERT INTO SportSubCategories (sportId, name) VALUES
-- Combat Sports (sportId = 1)
(1, 'Fencing'),
(1, 'Judo'),
(1, 'Karate'),
(1, 'Mixed Martial Arts (MMA)'),
(1, 'Taekwondo'),

-- Equestrian Sports (sportId = 2)
(2, 'Dressage'),
(2, 'Eventing'),
(2, 'Horse Racing'),
(2, 'Polo'),
(2, 'Show Jumping'),

-- Extreme Sports (sportId = 3)
(3, 'BMX'),
(3, 'Mountain Biking'),
(3, 'Parkour'),
(3, 'Rock Climbing'),
(3, 'Skateboarding'),
(3, 'Skydiving'),

-- Individual Sports (sportId = 4)
(4, 'Athletics (Track and Field)'),
(4, 'Badminton'),
(4, 'Boxing'),
(4, 'Cycling'),
(4, 'Golf'),
(4, 'Gymnastics'),
(4, 'Martial Arts'),
(4, 'Swimming'),
(4, 'Tennis'),
(4, 'Wrestling'),

-- Indoor Sports (sportId = 5)
(5, 'Indoor Soccer (Futsal)'),

-- Motorsports (sportId = 6)
(6, 'Drag Racing'),
(6, 'Formula 1'),
(6, 'IndyCar'),
(6, 'MotoGP'),
(6, 'NASCAR'),
(6, 'Rally Racing'),

-- Other Sports (sportId = 7)
(7, 'Archery'),
(7, 'Chess'),
(7, 'Esports'),
(7, 'Shooting'),

-- Racquet Sports (sportId = 8)
(8, 'Squash'),
(8, 'Table Tennis'),

-- Team Sports (sportId = 9)
(9, 'American Football'),
(9, 'Baseball'),
(9, 'Basketball'),
(9, 'Cricket'),
(9, 'Football (Soccer)'),
(9, 'Handball'),
(9, 'Hockey'),
(9, 'Rugby'),
(9, 'Volleyball'),
(9, 'Water Polo'),

-- Water Sports (sportId = 10)
(10, 'Diving'),
(10, 'Kayaking'),
(10, 'Rowing'),
(10, 'Sailing'),
(10, 'Surfing'),

-- Winter Sports (sportId = 11)
(11, 'Bobsleigh'),
(11, 'Curling'),
(11, 'Figure Skating'),
(11, 'Ice Hockey'),
(11, 'Luge'),
(11, 'Skiing'),
(11, 'Snowboarding'),
(11, 'Speed Skating');
