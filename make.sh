#!/bin/sh

echo "module.exports = \`$(tr "\`" "\\\`" < beandown.beef)\`" > beandown.beef.js
