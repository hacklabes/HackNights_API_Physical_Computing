#! /usr/bin/env python
# -*- coding: utf-8 -*-

from gpiozero import LED, Button
from signal import pause

# set up 2 buttons using physical pull_down resistors and 0.01 seconds of "debouncing"
yButton = Button(13,  pull_up=False, bounce_time=0.05)
rButton = Button(19, pull_up=False, bounce_time=0.05)

# set up 2 pins for LEDs
yLed = LED(16)
rLed = LED(21)

# define behavior for rButton
rButton.when_pressed = rLed.on
rButton.when_released = rLed.off

# define behavior for yButton
yButton.when_pressed = yLed.on
yButton.when_released = yLed.off

# pause programme until killing it with ctrl-c
pause()
