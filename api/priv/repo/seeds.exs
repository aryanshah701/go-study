alias Api.Repo
alias Api.Users.User
alias Api.Spaces.Space

# Seeding users
user1 = Repo.insert!(%User{
  name: "user1", email: "user1@gmail.com", password_hash: "temp"#Argon2.hash_pwd_salt("user1234")
})
#
# user2 = Repo.insert!(%User{
#   name: "user2", email: "user2@gmail.com", password_hash: Argon2.hash_pwd_salt("user1234")
# })
#
# user3 = Repo.insert!(%User{
#   name: "user3", email: "user3@gmail.com", password_hash: Argon2.hash_pwd_salt("user1234")
# })

spaces1 = Repo.insert!(%Space{
    name: "space1", description: "this is a description!", latitude: 42.3252, longitude: -71.0951,
    wifi: true, user_id: user1.id, website: "northeastern.edu", address: "744 Columbus Ave",
    google_rating: 4.7, opening_hours: ["M-S: 10am - 6pm"], photo: "", type: "dunno"
})
