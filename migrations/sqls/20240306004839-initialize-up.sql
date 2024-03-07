-- mengubah kolom id menjadi contraint dengan type serial dan primary key
ALTER TABLE users ADD COLUMN id_new SERIAL PRIMARY KEY; -- membuat id baru
UPDATE users SET id_new = id; -- menukar nilai id lama ke baru
ALTER TABLE users DROP COLUMN id; -- menghapus kolom id lama
ALTER TABLE users RENAME COLUMN id_new TO id; -- mengganti nama kolom id baru