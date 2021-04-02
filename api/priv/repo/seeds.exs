alias Api.Repo
alias Api.Users.User
alias Api.Spaces.Spaces

# Seeding users
user1 = Repo.insert!(%User{
  name: "user1", email: "user1@gmail.com", password_hash: Argon2.hash_pwd_salt("user1234")
})

user2 = Repo.insert!(%User{
  name: "user2", email: "user2@gmail.com", password_hash: Argon2.hash_pwd_salt("user1234")
})

user3 = Repo.insert!(%User{
  name: "user3", email: "user3@gmail.com", password_hash: Argon2.hash_pwd_salt("user1234")
})

