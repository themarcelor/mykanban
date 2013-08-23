#!/usr/bin/jjs
#
load("./mykanban/dao/mongoDAO.js");

print(mongoDAO.readAll());