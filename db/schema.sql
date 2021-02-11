CREATE TABLE IF NOT EXISTS tasks (
  id INT UNSIGNED AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  task_status VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
)

-- (docker exec -i task-mate_mysql_1 sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" $MYSQL_DATABASE' < db/schema.sql)