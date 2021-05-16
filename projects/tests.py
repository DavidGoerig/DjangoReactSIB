from django.test import TestCase
from projects import views

class FakeUserClass:
  def __init__(self, id, username):
    self.id = id
    self.username = username


"""
    Test of project view functions
"""
class ProjectsModelTest(TestCase):

    def test_del_user_from_list(self):
        fake_dict = {1:"user1", 11:"user2", 2:"user3"}
        u1 = FakeUserClass(2, "user3")
        views.del_user_from_dict(fake_dict, u1)
        self.assertEqual(fake_dict, {1:"user1", 11:"user2"})
        u1.id = 11
        views.del_user_from_dict(fake_dict, u1)
        self.assertEqual(fake_dict, {1:"user1"})
        u1.id = 1
        views.del_user_from_dict(fake_dict, u1)
        self.assertEqual(fake_dict, {})

    def test_add_user_to_list(self):
        fake_dict = {}
        u1 = FakeUserClass(2, "user3")
        views.add_user_to_list(fake_dict, u1)
        self.assertEqual(fake_dict, {2:"user3"})
        u1.username = "user2"
        u1.id = 11
        views.add_user_to_list(fake_dict, u1)
        self.assertEqual(fake_dict, {2:"user3", 11:"user2"})

    def test_check_if_user_in_dict(self):
        fake_dict = {1:"user1", 11:"user2", 2:"user3"}
        u1 = FakeUserClass(2, "user3")
        u2 = FakeUserClass(1, "user2")
        fake_dict_empty = {}

        self.assertEqual(views.check_if_user_in_dict(fake_dict, u1), True)
        self.assertEqual(views.check_if_user_in_dict(fake_dict, u2), False)
        self.assertEqual(views.check_if_user_in_dict(fake_dict_empty, u1), False)

    def test_from_dict_to_string(self):
        string_good = "1:user1;11:user2;2:user3"
        string_bad = "1:user1;11:user2;2:user3;"
        fake_dict = {1:"user1", 11:"user2", 2:"user3"}
        fake_dict_empty = {}
        self.assertEqual(views.from_dict_to_string(fake_dict), string_good)
        self.assertNotEqual(views.from_dict_to_string(fake_dict), string_bad)
        self.assertEqual(views.from_dict_to_string(fake_dict_empty), "")


    def test_from_string_to_dict(self):
        string_good = "1:user1;11:user2;2:user3"
        string_bad = "1:user1;11:user2;2:user3;"
        fake_dict = {1:"user1", 11:"user2", 2:"user3"}
        fake_dict_empty = {}
        self.assertEqual(views.from_string_to_dict(string_good), fake_dict)
        self.assertEqual(views.from_string_to_dict(string_bad), fake_dict)
        self.assertEqual(views.from_string_to_dict(""), fake_dict_empty)

