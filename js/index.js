(function() {
    /**
     * Helper object for working with countries data and extracting information.
     * See countries-data.js for format of the countries data set.
     */
    var countries = {
        /**
         * Store all countries from countries-data.js on `countries.all` for convenience.
         */
        all: window.countriesData,

        /**
         * Return an array of all countries, with the Name Object replaced by the
         * appropriate translation, or English if not specified (or unknown).  For
         * example, when language="English", you would process the record for Canada into:
         *
         * {
         *     code: "CA",
         *     continent: "Americas",
         *     areaInKm2: 9984670,
         *     population: 36624199,
         *     capital: "Ottawa",
         *     name: "Canada"
         * }
         *
         * Supported languages include:
         *
         * English, Arabic, Chinese, French, Hindi, Korean, Japanese, Russian
         *
         * Uses `countries.all` as the underlying array of countries to be processed.
         */
        getByLanguage: function(language = 'English') {
            // New Array object created so that we don't alter the original Array of objects.
            var newArr = [];
            for (var i = 0; i < this.all.length; i++) {
                // Shallow copy using for loop x[i] = y[i] assignments produced erroneous results.
                // Object.assign() pseudo-deep copies instead :
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign,
                // https://medium.com/@tkssharma/objects-in-javascript-object-assign-deep-copy-64106c9aefab
                // Would not work with objects with non-enumerable properties, like functions. This is fine in our case.
                newArr.push(Object.assign({}, this.all[i]));
                if (language) newArr[i].name = this.all[i].name[language];
            }
            return newArr;
        },

        /**
         * Return an array of countries with a population greater than or equal to
         * `minPopulation`, and possibly less than equal to `maxPopulation` (if defined)
         * otherwise allow any number greater than `minPopulation`.
         *
         * Uses getByLanguage('English') to get English names for countries.
         *
         * @param {Number} minPopulation - (Required) minimum population value
         * @param {Number} maxPopulation - (Optional) maximum population value
         */
        getByPopulation: function(minPopulation, maxPopulation) {
            var newArr = [];
            var country = countries.getByLanguage('English');
            for (var i = 0; i < country.length; i++) {
                if (maxPopulation) {
                    if (
                        country[i].population <= maxPopulation &&
                        country[i].population >= minPopulation
                    )
                        newArr.unshift(country[i]);
                } else {
                    if (country[i].population >= minPopulation)
                        newArr.unshift(country[i]);
                }
            }
            return newArr;
        },

        /**
         * Return an array of countries for the given `continent` with an area
         * greater than or equal to the given `area` in square KM.
         *
         * Uses getByLanguage('English') to get English names for countries.
         *
         * @param {String} continent - (Required) name of the continent (e.g., Europe)
         * @param {Number} minArea - (Required) minimum number of KM2 area
         */
        getByAreaAndContinent: function(continent, minArea) {
            var newArr = [];
            var country = countries.getByLanguage('English');
            for (var i = 0; i < country.length; i++) {
                if (country[i].continent === continent) {
                    if (country[i].areaInKm2 >= minArea)
                        newArr.unshift(country[i]);
                }
            }
            return newArr;
        }
    };

    /**
     * Helper functions for building table elements.
     */
    var tableHelper = {
        /**
         * Clears (any) existing rows from the #table-rows table body
         */
        clearTable: function() {
            var tableRows = document.querySelector('#table-rows');
            // Replaces the content in the tbody node with an empty string to "clear" it.
            tableRows.innerHTML = '';
        },

        /**
         * Takes a `country.code` (e.g., "CA" for Canada) and returns an <img>
         * element with its `src` property set the appropriate flag image URL
         * for this code, e.g., src="flags/ca.png" for Canada.
         */

        // Constructs and returns an img node with appropriate src to png file.
        countryCodeToFlagImg: function(countryCode) {
            var image = document.createElement('img');
            image.src = `flags/${countryCode}.png`;
            return image;
        },

        /**
         * Takes a single `country` object and converts it to a <tr> with <td>
         * child elements for every column in the row.  The row should match the
         * expected format of the table (i.e., flag, code, country, continent, etc).
         * Return the new <tr>...</tr> row.
         *
         * Use the DOM methods document.createElement(), element.appendChild(), etc
         * to create your <tr> row.
         */

        // Creates a tr node with appropriate td nodes appended to it (e.g., flag, code, country/dept name, etc)
        // to create a single row of data in our table. Using DOM manip. methods to avoid
        // using template literals (which is what I did in my last assignment), e.g.,:
        /* 
            var tableRow = document.createElement("tr");
            tableRow.innerHTML = `<td>${tableHelper.countryCodeToFlagImg(
                country.code
            )}</td><td>${country.code}</td><td>${country.name}</td><td>${
                country.continent
            }</td><td>${country.areaInKm2}</td><td>${
                country.population
            }</td><td>${country.capital}</td>`;
            var element = document.querySelector("#table-rows");
            element.appendChild(tableRow);
 
            return tableRow;
        */
        countryToRow: function(country) {
            var tableRow = document.createElement('tr');

            var flagCell = document.createElement('td');
            var flagPNG = this.countryCodeToFlagImg(country.code);
            tableRow.appendChild(flagCell).appendChild(flagPNG);

            var codeCell = document.createElement('td');
            var code = document.createTextNode(country.code);
            tableRow.appendChild(codeCell).appendChild(code);

            var countryNameCell = document.createElement('td');
            var countryName = document.createTextNode(country.name);
            tableRow.appendChild(countryNameCell).appendChild(countryName);

            var continentCell = document.createElement('td');
            var continent = document.createTextNode(country.continent);
            tableRow.appendChild(continentCell).appendChild(continent);

            var areaCell = document.createElement('td');
            var area = document.createTextNode(country.areaInKm2);
            tableRow.appendChild(areaCell).appendChild(area);

            var populationCell = document.createElement('td');
            var population = document.createTextNode(country.population);
            tableRow.appendChild(populationCell).appendChild(population);

            var capitalCell = document.createElement('td');
            var capital = document.createTextNode(country.capital);
            tableRow.appendChild(capitalCell).appendChild(capital);

            return tableRow;
        },

        /**
         * Takes an array of `country` Objects named `countries`, and passes each
         * `country` in the array  to `tableHelper.countryToRow()`.  The resulting
         * rows are then appended to the #table-rows table body element.  Make sure
         * you use `tableHelper.clear()` to remove any existing rows before you do this.
         */

        // Clears current table via clearTable() method, then appends every row returned
        // via countryToRow method and appends it to the tbody node. All of the table data
        // is constructed in this way.
        countriesToTable: function(countries) {
            this.clearTable();
            for (var i = 0; i < countries.length; i++) {
                var rows = this.countryToRow(countries[i]);
                document.querySelector('#table-rows').appendChild(rows);
            }
        }
    };

    /**
     * Register click handlers for every menu item in the page.  Use the `countries`
     * and `tableHelper` Objects, and their associated methods, to update/populate
     * the #table-rows table body with the appropriate set of countries, based on the
     * menu item clicked.
     *
     * Make sure you also update the #subtitle heading to properly reflect what
     * is in the table after you populate it. For example: "List of Countries
     * and Dependencies - Population between 1 and 2 millon" or "List of Countries
     * and Dependencies - All countries in Asia" etc.
     */

    // Each menu button and its corresponding subtitle (h4) node is handled
    // via an event listener, which calls the appropriate functions upon click.
    // countriesToTable method called to construct the tables given the
    // appropriate array of objects (returned by various methods defined
    // in our countries object).

    function setupMenuHandlers() {
        document
            .querySelector('#menu_english')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(countries.getByLanguage());
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in English';
            });
        document
            .querySelector('#menu_arabic')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(countries.getByLanguage('Arabic'));
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in Arabic';
            });
        document
            .querySelector('#menu_chinese')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(
                    countries.getByLanguage('Chinese')
                );
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in Chinese';
            });
        document
            .querySelector('#menu_french')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(countries.getByLanguage('French'));
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in French';
            });
        document
            .querySelector('#menu_hindi')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(countries.getByLanguage('Hindi'));
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in Hindi';
            });
        document
            .querySelector('#menu_korean')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(countries.getByLanguage('Korean'));
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in Korean';
            });
        document
            .querySelector('#menu_japanese')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(
                    countries.getByLanguage('Japanese')
                );
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in Japanese';
            });
        document
            .querySelector('#menu_russian')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(
                    countries.getByLanguage('Russian')
                );
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies in Russian';
            });

        document
            .querySelector('#menu_population_100_000_000m')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(
                    countries.getByPopulation(100000000)
                );
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies - Population greater than 100 million';
            });
        document
            .querySelector('#menu_population_1m_2m')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(
                    countries.getByPopulation(1000000, 2000000)
                );
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies - Population between 1 and 2 millon';
            });
        document
            .querySelector('#menu_americas_1mkm')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(
                    countries.getByAreaAndContinent('Americas', 1000000)
                );
                document.querySelector('#subtitle').innerHTML =
                    'List of Countries and Dependencies - All countries in Americas with area greater than 1 million km<sup>2</sup';
            });
        document
            .querySelector('#menu_asia_all')
            .addEventListener('click', function() {
                tableHelper.countriesToTable(
                    countries.getByAreaAndContinent('Asia', 0)
                );
                document.querySelector('#subtitle').textContent =
                    'List of Countries and Dependencies - All countries in Asia';
            });
    }

    // When the page loads, setup all event handlers by calling setup function.
    window.onload = setupMenuHandlers;
})();
