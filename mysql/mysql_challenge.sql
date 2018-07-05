USE sakila;

-- 1a Display the first and last names of all actors from the table actor.
SELECT first_name, last_name FROM actor;

-- 1b Display the first and last name of each actor in a single column in upper case letters. Name the column Actor Name.
SELECT UPPER(CONCAT(first_name, " ", last_name)) AS 'Actor Name' FROM actor;

-- 2a You need to find the ID number, first name, and last name of an actor, of whom you know only the first name, "Joe." 
-- What is one query would you use to obtain this information?
SELECT actor_id, first_name, last_name FROM actor WHERE first_name = 'Joe';

-- 2b Find all actors whose last name contain the letters GEN:
SELECT * FROM actor WHERE last_name LIKE '%GEN%';

-- 2c Find all actors whose last names contain the letters LI. This time, order the rows by last name and first name, in that order:
SELECT last_name, first_name FROM actor WHERE last_name LIKE '%LI%';

-- 2d Using IN, display the country_id and country columns of the following countries: Afghanistan, Bangladesh, and China
SELECT country_id, country FROM country WHERE country IN ('Afghanistan', 'Bangladesh', 'China');

-- 3a Add a middle_name column to the table actor. Position it between first_name and last_name. 
ALTER TABLE actor ADD COLUMN middle_name varchar(30) AFTER first_name;

-- 3b You realize that some of these actors have tremendously long last names. Change the data type of the middle_name column to blobs.
ALTER TABLE actor MODIFY middle_name blob;

-- 3c Now delete the middle_name column.
ALTER TABLE actor DROP middle_name;

-- 4a List the last names of actors, as well as how many actors have that last name.
SELECT last_name, COUNT(last_name) as 'Name Total'
FROM actor
GROUP BY last_name;

-- 4b List last names of actors and the number of actors who have that last name, but only for names that are shared by at least two actors.
SELECT last_name, COUNT(last_name) as 'Name Total'
FROM actor
GROUP BY last_name
HAVING COUNT(last_name) >= 2;

-- 4c Oh, no! The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS, 
-- the name of Harpo's second cousin's husband's yoga teacher. Write a query to fix the record.
UPDATE actor
SET first_name = 'Harpo'
WHERE actor_id = 172;

-- 4d In a single query, if the first name of the actor is currently HARPO, change it to GROUCHO. Otherwise, change the first name to MUCHO GROUCHO,
UPDATE actor
SET first_name = CASE WHEN first_name = 'Harpo' THEN  'GROUCHO'
ELSE 'MOUCHO GROUCO' END
WHERE actor_id = 172;

-- 5a You cannot locate the schema of the address table. Which query would you use to re-create it?
SHOW CREATE TABLE address;

-- 6a Use JOIN to display the first and last names, as well as the address, of each staff member. Use the tables staff and address:
SELECT s.first_name, s.last_name, a.address
FROM staff s
JOIN address a
ON (s.address_id = a.address_id);

-- 6b Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.
SELECT s.first_name, s.last_name, SUM(CASE WHEN p.payment_date Like '%2005-08%' THEN p.amount ELSE 0 END) AS 'Total'
FROM payment p
JOIN staff s
ON (s.staff_id = p.staff_id)
GROUP BY s.first_name;

-- 6c List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.
SELECT f.title, COUNT(a.actor_id) AS 'Total Actors'
FROM film f
INNER JOIN film_actor a
ON f.film_id = a.film_id
GROUP BY f.title;

-- 6d How many copies of the film Hunchback Impossible exist in the inventory system?
SELECT f.title, COUNT(i.inventory_id) AS 'Total Copies'
FROM film f
JOIN inventory i
ON f.film_id = i.film_id
WHERE f.film_id = 439;

-- 6e Using the tables payment and customer and the JOIN command, list the total paid by each customer. List the customers alphabetically by last name:
SELECT c.last_name, c.first_name, SUM(p.amount) AS 'Total Payments'
FROM customer c
JOIN payment p
ON (c.customer_id = p.customer_id)
GROUP BY c.last_name
ORDER BY c.last_name ASC;

-- 7a Use subqueries to display the titles of movies starting with the letters K and Q whose language is English.
SELECT title
FROM film
WHERE LEFT(title, 1) = 'K' OR LEFT(title, 1) = 'Q'
AND language_id IN (
	SELECT language_id
    FROM language
    WHERE name = 'English');
    
-- 7b Use subqueries to display all actors who appear in the film Alone Trip.
SELECT first_name, last_name
FROM actor
WHERE actor_id in  (
	SELECT actor_id
    FROM film_actor
    WHERE film_id in (
		SELECT film_id
        FROM film
        WHERE title = 'Alone Trip'));
        
-- 7c You want to run an email marketing campaign in Canada, for which you will need the names and email addresses of all Canadian customers. 
-- Use joins to retrieve this information.
SELECT first_name, last_name, email
FROM customer cus
JOIN address a
ON (cus.address_id = a.address_id)
JOIN city c
ON (c.city_id = a.city_id)
JOIN country con
On (con.country_id = c.country_id)
WHERE con.country = 'Canada';

-- 7d Sales have been lagging among young families, and you wish to target all family movies for a promotion. Identify all movies categorized as famiy films.
SELECT title
FROM film
WHERE film_id IN (
	SELECT film_id
    FROM film_category
    WHERE category_id IN (
		SELECT category_id
        FROM category
        WHERE name = 'Family'));

-- 7e. Display the most frequently rented movies in descending order.
SELECT f.title, COUNT(r.inventory_id) AS 'Total Rentals'
FROM film f
JOIN inventory i
ON (f.film_id = i.film_id)
JOIN rental r
ON (i.inventory_id = r.inventory_id)
GROUP BY f.title
ORDER BY COUNT(r.inventory_id) DESC;

-- 7f. Write a query to display how much business, in dollars, each store brought in.
SELECT store.store_id AS 'Store', CONCAT(c.city, ', ', con.country) AS 'Store Location', SUM(p.amount) AS 'Total Revenue'
FROM store
JOIN staff
ON (store.manager_staff_id = staff.staff_id)
JOIN payment p
ON (staff.staff_id = p.staff_id)
JOIN address a
ON (store.address_id = a.address_id)
JOIN city c
ON (c.city_id = a.city_id)
JOIN country con
On (con.country_id = c.country_id)
GROUP BY store.store_id;

-- 7g. Write a query to display for each store its store ID, city, and country.
SELECT store.store_id AS 'Store ID', c.city AS 'City', con.country AS 'Country'
FROM store
JOIN staff
ON (store.manager_staff_id = staff.staff_id)
JOIN address a
ON (store.address_id = a.address_id)
JOIN city c
ON (c.city_id = a.city_id)
JOIN country con
On (con.country_id = c.country_id);

-- 7h. List the top five genres in gross revenue in descending order. 
SELECT cat.name AS 'Genre', SUM(p.amount) AS 'Gross Revenue'
FROM category cat
JOIN film_category fc
ON (cat.category_id = fc.category_id)
JOIN inventory i
ON (fc.film_id = i.film_id)
JOIN rental r
ON (i.inventory_id = r.inventory_id)
JOIN payment p
On (r.rental_id = p.rental_id)
GROUP BY cat.name
ORDER BY SUM(p.amount) DESC
LIMIT 5;

-- 8a. Use the solution from the problem above to create a view. 
CREATE VIEW top_five_genres AS
SELECT cat.name AS 'Genre', SUM(p.amount) AS 'Gross Revenue'
FROM category cat
JOIN film_category fc
ON (cat.category_id = fc.category_id)
JOIN inventory i
ON (fc.film_id = i.film_id)
JOIN rental r
ON (i.inventory_id = r.inventory_id)
JOIN payment p
On (r.rental_id = p.rental_id)
GROUP BY cat.name
ORDER BY SUM(p.amount) DESC
LIMIT 5;

-- 8b. How would you display the view that you created in 8a?
select * from top_five_genres;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.
DROP VIEW top_five_genres;