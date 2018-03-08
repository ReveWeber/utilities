# Using Liquid and YAML in Jekyll

This cheatsheet covers all the Liquid and YAML I have so far made use of for Jekyll builds of pages and page components.

For more: [Jekyll documentation](https://jekyllrb.com/docs/frontmatter/), [Liquid documentation](https://help.shopify.com/themes/liquid). 

### General notes:
1. Unless otherwise specified, all YAML is to be placed between the triple dashes of your page data file (page-name.html in the top-level directory or a subfolder that does not begin with an underscore).
2. If the value of a YAML element has a colon in it, you must enclose it in quotation marks.
3. In general the resulting HTML will have more whitespace in it than I have represented here, at least in the case of loops.

---

## Layout Selection:

**YAML**
```
layout: layout-name
```

There is no Liquid for this; Jekyll will look for layout-name.html within the `_layouts` folder and build the page based on that. This is the only required YAML value for a Jekyll template, and one of only a few that are predefined - in this file, `layout`, `page`, and `content` are reserved names, and all others are freely self-chosen.

---

## Simple Value Insertion:

**YAML**
```
title: This Page's Title
```

**Liquid in HTML**
```
<title>{{ page.title }}</title>
```

**Result**
```
<title>This Page's Title</title>
```

---

## Content Insertion:

**YAML**<br>
Not really YAML, but the same file; whatever HTML or Markdown you'd like, below the block demarcated by triple dashes.

**Liquid in HTML**
```
{{ content }}
```

**Result**<br>
Insertion of your HTML verbatim or compiled Markdown into the specified location.

---

## Conditional Value Insertion 1:

**YAML 1**
```
topic: Ideas
season: Spring
```

**YAML 2**
```
topic: Styles
season:
```

(or omit the entire "season" line from version 2)

**Liquid in HTML**
```
<h1>{{ page.topic }}{% if page.season %} for {{ page.season }}{% endif %}</h1>
```

**Result 1**
```
<h1>Ideas for Spring</h1>
```

**Result 2**
```
<h1>Styles</h1>
```


## Conditional Value Insertion 2:

**YAML**
```
menu-highlight: about
```

**Liquid in HTML**
```
<ul>
<li {% if page.menu-highlight == "home" %}class="highlighted"{% endif %}><a href="/">Home</a></li>
<li {% if page.menu-highlight == "about" %}class="highlighted"{% endif %}><a href="/about/">About</a></li>
<li {% if page.menu-highlight == "blog" %}class="highlighted"{% endif %}><a href="/blog/">Blog</a></li>
</ul>
```

**Result**
```
<ul>
<li ><a href="/">Home</a></li>
<li class="highlighted"><a href="/about/">About</a></li>
<li ><a href="/blog/">Blog</a></li>
</ul>
```

---

## Looping through Lists:

**YAML**
```
item-list:
 - name: pencil
   use: writing
 - name: eraser
   use: erasing
```

**Liquid in HTML**
```
<p>You will need:</p>
<ul>
{% for item in page.item-list %}
<li>One {{ item.name }}, for {{ item.use }}</li>
{% endfor %}
</ul>
```

**Result**
```
<p>You will need:</p>
<ul>
<li>One pencil, for writing</li>
<li>One eraser, for erasing</li>
</ul>
```


## Using the Loop Index:

**YAML** as above

**Liquid in HTML**
```
<p>Please bring:</p>
{% for item in page.item-list %}
<p id="item-{{ forloop.index }}">{{ item.name }} for {{ item.use }}</p>
{% endfor %}
```

**Result**
```
<p>Please bring:</p>
<p id="item-1">pencil for writing</p>
<p id="item-2">eraser for erasing</p>
```

Note: This does indeed start at 1; `forloop.index0` will give you the 0-based index.


## Limiting Loop Iterations

**YAML**
```
hotel-features:
 - name: Indoor Pool
 - name: Fitness Room
 - name: Continental Breakfast
 - name: Complimentary Newspaper
```

**Liquid in HTML**
```
<h1>Features: {% for feature in page.hotel-features limit:2 %}{{ feature.name }}, {% endfor %}and more!</h1>
```

**Result**
```
<h1>Features: Indoor Pool, Fitness Room, and more!</h1>
```

---

## Using Page Fragments

In its most basic form, you put
```
{% include fragment.html %}
```
in your page and Jekyll will look for a file named fragment.html within the `_includes` folder.

You can also use page-specific values in the include statement and in the included fragment:

**YAML**
```
header: hero-header
hero: amazing.jpg
```

**Liquid in wrapper HTML**
```
{% include shared-topmatter.html %}
{% include headers/{{ page.header }}.html %}
```

**Liquid in hero-header.html**
```
<!-- hero markup --><img src="images/{{ page.hero }}"><!-- rest of hero markup -->
```

**Directory structure**
```
_includes/
  shared-topmatter.html
  headers/
    hero-header.html
```

Included fragments can include other fragments, and no matter the depth they can access page-specific values.
