USE sakila;


-- 1a
SELECT first_name, last_name FROM actor;

-- 1b
SELECT UPPER(CONCAT(first_name, " ", last_name)) AS 'Actor Name' FROM actor;

-- 2a
SELECT actor_id, first_name, last_name FROM actor WHERE first_name = 'Joe';

-- 2b
SELECT * FROM actor WHERE last_name LIKE '%GEN%';

-- 2c
SELECT last_name, first_name FROM actor WHERE last_name LIKE '%LI%';

-- 2d
SELECT country_id, country FROM country WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

-- 3a
ALTER TABLE actor ADD COLUMN middle_name varchar(30) AFTER first_name;

-- 3b
ALTER TABLE actor MODIFY middle_name blob;

-- 3c
ALTER TABLE actor DROP middle_name;

-- 4a
SELECT last_name, COUNT(last_name) as 'Name Total'
FROM actor
GROUP BY last_name;

-- 4b
SELECT last_name, COUNT(last_name) as 'Name Total'
FROM actor
GROUP BY last_name
HAVING COUNT(last_name) >= 2;

-- 4c
UPDATE actor
SET first_name = 'Harpo'
WHERE actor_id = 172;

-- 4d
UPDATE actor
SET first_name = CASE WHEN first_name = 'Harpo' THEN  'GROUCHO'
ELSE 'MOUCHO GROUCO' END
WHERE actor_id = 172;

-- 5a
SHOW CREATE TABLE address;

-- 6a
SELECT s.first_name, s.last_name, a.address
FROM staff s
JOIN address a
ON (s.address_id = a.address_id);

-- 6b
SELECT s.first_name, s.last_name, SUM(CASE WHEN p.payment_date Like '%2005-08%' THEN p.amount ELSE 0 END) AS 'Total'
FROM payment p
JOIN staff s
ON (s.staff_id = p.staff_id)
GROUP BY s.first_name;

-- 6c
SELECT f.title, COUNT(a.actor_id) AS 'Total Actors'
FROM film f
INNER JOIN film_actor a
ON f.film_id = a.film_id
GROUP BY f.title;

-- 6d
SELECT f.title, COUNT(i.inventory_id) AS 'Total Copies'
FROM film f
JOIN inventory i
ON f.film_id = i.film_id
WHERE f.film_id = 439;

-- 6e
SELECT c.last_name, c.first_name, SUM(p.amount) AS 'Total Payments'
FROM customer c
JOIN payment p
ON (c.customer_id = p.customer_id)
GROUP BY c.last_name
ORDER BY c.last_name ASC;

select * from customer; 
select * from payment;
