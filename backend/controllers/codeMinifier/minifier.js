const codeBody = `
	/**
	 * Method which delays flights matching a flightNumberSearchKey in a List<CommmercialFlight>
	 * @param commercialFlightList - list to be searched 
	 * @param flightNumberToDelay - flightnumber search key - flights with this flightnumber should be delayed
	 * @param delayTime - LocalTime - time to delay flight to
	 */
	private static void delayFlightNumberToTime(List<CommercialFlight> commercialFlightList, String flightNumberToDelay,
			LocalTime delayTime) {
		
		
		for (CommercialFlight commercialFlight : commercialFlightList) {
			
			String flightNumber = commercialFlight.getFlightNumber();
			
			if(flightNumber.equalsIgnoreCase(flightNumberToDelay)) {
				commercialFlight.delayFlightToTime(delayTime);
			}
			
			
		}
		
	}

	/**
	 * helper method which iterates through a list of commercialflights and displays all them,
	 * calling the toString method
	 * @param commercialFlightList - list to display
	 */
	private static void displayAllFlights(List<CommercialFlight> commercialFlightList) {
		
		for(CommercialFlight commercialFlight : commercialFlightList) {
			
			
			System.out.println(commercialFlight.toString());
			
		}
		
	}
	
	/**
	 * Method which reads in at a target file, and populates a passed list with commercial flight
	 * objects found in that file - selectively ignores flights with prefixes matching the flightPrefixesToIgnore list
	 * @param commercialFlightList - destination list for population
	 * @param fileName - file to be parsed's name
	 * @param flightPrefixesToIgnore - flight prefixes which should be ignored
	 */
	private static void readData(List<CommercialFlight> commercialFlightList, String fileName,
			List<String> flightPrefixesToIgnore) {
            
		System.out.println("Loading data...");
		File file = new File(fileName);

		FileReader fr;
		try {
			fr = new FileReader(file);

			BufferedReader br = new BufferedReader(fr);

			// skip first line of column names
			br.readLine();

			String line = br.readLine();

			// counters for line reading stats

			int linesReadOk = 0;
			int linesReadBad = 0;
			int linesReadIgnored = 0;

			while (line != null) {
				// specification says we must output data as it is read in
				System.out.println(line);

				// now do stuff with the line

				// wrap this whole thing in a try catch
				// means any wrongly formatted data or data which triggers
				// exception to be thrown in business rules
				// will not prevent the rest of the data being read in

				// - try catch occurs within while loop

				try {
					String[] splitLine = line.split(",");

					String flightNumber = splitLine[0];
					String airline = splitLine[1];
					String departureTimeAsString = splitLine[2];
					String destination = splitLine[3];
					String airportCode = splitLine[4];
					String country = splitLine[5];
					String gate = splitLine[6];
					String boardingStatusAsString = splitLine[7];
					int passengerNumber = Integer.valueOf(splitLine[8]);

					String[] departureTimeAsStringSplit = departureTimeAsString.split(":");

					int departureTimeHours = Integer.valueOf(departureTimeAsStringSplit[0]);
					int departureTimeMins = Integer.valueOf(departureTimeAsStringSplit[1]);

					LocalTime departureTime = LocalTime.of(departureTimeHours, departureTimeMins);

					BoardingStatus boardingStatus = BoardingStatus.getBoardingStatusFromString(boardingStatusAsString);
					
					if(boardingStatus == null) {
						throw new IllegalArgumentException();
					}

					// now need to do logic to determine if this is a military flight - if its
					// prefix is m
					Boolean flightDisallowed = isFlightDisallowed(flightNumber, flightPrefixesToIgnore);

					if (flightDisallowed) {

						linesReadIgnored++;
					} else {
						CommercialFlight commercialFlight = new CommercialFlight(flightNumber, airline, departureTime,
								destination, country, gate, airportCode, boardingStatus, passengerNumber);

						commercialFlightList.add(commercialFlight);
						linesReadOk++;
					}

				} catch (Exception e) {

					linesReadBad++;

				}

				// could do this in a finally but i think its clearer like this
				// move to next line in csv
				line = br.readLine();
			}

			br.close();
			System.out.println("Attempted to read flight data : " + (linesReadBad + linesReadIgnored + linesReadOk));
			System.out.println("Flight data read successfully : " + linesReadOk);
			System.out.println("Lines ignored : " + linesReadIgnored);
			System.out.println("Lines unsuccessfully read : " + linesReadBad);

		} catch (FileNotFoundException e) {
			System.out.println("FILE NOT FOUND - " + fileName);

			e.printStackTrace();
		} catch (IOException e) {
			System.out.println("IO EXCEPTION TRIGGERED WHEN READING FROM - " + fileName);
			e.printStackTrace();
		}

	}
	
	/**
	 * helper method which determines whether a flight is disallowed
	 * @param flightNumber - the flightNumber of the flight to detect
	 * @param flightPrefixesToIgnore - flight prefixes which should be ignored
	 * @return - return true if the flightNumber has one of the disallowed prefixes - false otherwise
	 */
	private static Boolean isFlightDisallowed(String flightNumber, List<String> flightPrefixesToIgnore) {

		// use split to keep these all as strings - simpler equals methods
		String[] flightNumberSplit = flightNumber.split("");

		String flightPrefix = flightNumberSplit[0];

		for (String flightPrefixIgnore : flightPrefixesToIgnore) {

			if (flightPrefixIgnore.equalsIgnoreCase(flightPrefix)) {
				return true;
			}

		}

		return false;
	}
    char someChar = 'x';
}
`;




const minifyCode = (stringToMinify) => {
    let result = '';
    let inSingleQuoteString = false;
    let inDoubleQuoteString = false;
    let inMultiLineComment = false;
    let escapeNextChar = false;
    let skipLine = false;

    for (let i = 0; i < stringToMinify.length; i++) {
        let char = stringToMinify[i];

        // Handle escape sequences
        if (escapeNextChar) {
            escapeNextChar = false;
            result += char;
            continue;
        }

        // Toggle flags for entering or exiting string literals and multi-line comments
        if (char === '"' && !inSingleQuoteString && !inMultiLineComment) {
            inDoubleQuoteString = !inDoubleQuoteString;
        } else if (char === '\'' && !inDoubleQuoteString && !inMultiLineComment) {
            inSingleQuoteString = !inSingleQuoteString;
        } else if (char === '/' && !inSingleQuoteString && !inDoubleQuoteString && !inMultiLineComment) {
            if (stringToMinify[i + 1] === '/') {
                // Single-line comment starts
                result += char;
                inMultiLineComment = false;
                skipLine = true;
                continue;
            } else if (stringToMinify[i + 1] === '*') {
                // Multi-line comment starts
                inMultiLineComment = true;
            }
        } else if (char === '*' && inMultiLineComment && stringToMinify[i + 1] === '/') {
            // Multi-line comment ends
            inMultiLineComment = false;
            result += char
            continue;
        }

        // Skip characters if inside a comment
        if (inMultiLineComment) {
            if (char === '\n' || char === '\r' || char === '\t') {
                result += ' '
            } else {
                result += char
            }
            continue;
        }

        if (skipLine) {
            if (char === '\n') {
                skipLine = false; // Reset the flag at the end of the line
            }
            result += char
            continue;
        }

        // Append character or skip new line based on context
        if (char === '\n' || char === '\r' || char === '\t') {
            if (inSingleQuoteString || inDoubleQuoteString) {
                result += char; // Keep new line if inside a string literal
            } else {
                result += ' ';
            }
        } else if (char === '\\') {
            result += char; // Keep escape character
            escapeNextChar = true;
        } else {
            result += char; // Always add the character if it's not a new line or escape character
        }
    }

    return result;
};




const removeTrailingSpacesMinify = (result) => {
    let finalResult = '';
    let inSingleQuoteString = false;
    let inDoubleQuoteString = false;
    let inTemplateLiteral = false;
    let inMultiLineComment = false;
    let skipLine = false;

    for (let i = 0; i < result.length; i++) {
        let char = result[i];


        if (char === '\n' && skipLine) {
            skipLine = false;
        }

        // Check if inside a comment or a line to be skipped
        if (inMultiLineComment || skipLine) {
            finalResult += char;
            continue;
        }

        // Toggle flags for entering or exiting string literals and comments
        if (char === '"' && !inSingleQuoteString && !inTemplateLiteral) {
            inDoubleQuoteString = !inDoubleQuoteString;
        } else if (char === '`' && !inSingleQuoteString) {
            inTemplateLiteral = !inTemplateLiteral;
        } else if (char === '/' && !inSingleQuoteString && !inDoubleQuoteString) {
            if (result[i + 1] === '/') {
                // Single-line comment starts
                skipLine = true;
            } else if (result[i + 1] === '*') {
                // Multi-line comment starts
                inMultiLineComment = true;
            }
        } else if (char === '*' && inMultiLineComment && result[i + 1] === '/') {
            // Multi-line comment ends
            inMultiLineComment = false;
            i++; // Skip the closing slash
            continue;
        } else if (char === '\'' && !inDoubleQuoteString && !inTemplateLiteral) {
            inSingleQuoteString = !inSingleQuoteString;
        }

        // Process only if not in comments or string literals
        if (!inMultiLineComment && !skipLine && !inSingleQuoteString && !inDoubleQuoteString && !inTemplateLiteral) {
            // Append character if not a trailing space
            if (!(char === ' ' && (result[i + 1] === undefined || result[i + 1] === ' '))) {
                finalResult += char;
            }
        } else {
            finalResult += char; // Keep character as is
        }

        // Reset skipLine flag if newline encountered
        if (char === '\n' && skipLine) {
            skipLine = false;
        }
    }

    return finalResult;
};


// console.log(minifyCode(codeBody))
// console.log('--------------')
// console.log(removeTrailingSpacesMinify(minifyCode(removeTrailingSpacesMinify(minifyCode(codeBody)))))



const identifyIgnoreSpots = (stringToIdentify) => {

    let ignoreStarts = []
    let ignoreEnds = []


    for (let i = 0; i < stringToIdentify.length; i++) {


        // handle javadoc
        // handle start = '/**' end = '*/'
        if (stringToIdentify[i] === '/' && stringToIdentify[i + 1] === '*') {
            // we are in a javadoc
            ignoreStarts.push(i)
            for (let j = i; j < stringToIdentify.length; j++) {
                if (stringToIdentify[j] === '*' && stringToIdentify[j + 1] === '/') {
                    ignoreEnds.push(j)
                    i = j + 2
                    break;
                }
            }
        }


        // handle single line comment
        if (stringToIdentify[i] === '/' && stringToIdentify[i + 1] === '/') {
            // we are in a single line comment
            ignoreStarts.push(i)
            for (let j = i; j < stringToIdentify.length; j++) {
                if ((stringToIdentify[j] === '\\' && stringToIdentify[j + 1] === 'n') || stringToIdentify[j] === '\n') {
                    ignoreEnds.push(j+1)
                    i = j + 1
                    break
                } else if(stringToIdentify[j] === '\n'){
                    ignoreEnds.push(j)
                    i = j+1
                }


            }

        }


        // handle double quotes
        if (stringToIdentify[i] === '"') {
            // we are in a string literal
            ignoreStarts.push(i)
            for (let j = i + 1; j < stringToIdentify.length; j++) {
                if (stringToIdentify[j] === '"') {
                    ignoreEnds.push(j)
                    i = j + 1
                    break
                }

            }
        }

        // handle single quotes
        if (stringToIdentify[i] === '\'') {
            // we are in a char declaration
            ignoreStarts.push(i)
            for (let j = i + 1; j < stringToIdentify.length; j++) {
                if (stringToIdentify[j] === '\'') {
                    ignoreEnds.push(j)
                    i = j + 1
                }

            }

        }





        // console.log(`${i}:${stringToIdentify[i]}`)
    }

    // const ignoreArraysObject = {
    //     ignoreStarts, ignoreEnds
    // }
    // return ignoreArraysObject

    let ignoreObjectsArray = []

    for (let i = 0; i < ignoreStarts.length; i++) {
        let ignoreStart = ignoreStarts[i]
        let ignoreEnd = ignoreEnds[i]

        const ignoreObject = { ignoreStart, ignoreEnd }
        ignoreObjectsArray.push(ignoreObject)

    }
    return ignoreObjectsArray
}


// console.log(identifyIgnoreSpots(codeBody))


const minifyWithIgnores = (stringToMinify, ignoreObjectsArray) => {
    let minifiedString = ''
    let minifiedArray = []
    for (let i = 0; i < stringToMinify.length; i++){
        // check if i is === to ignoreStart
        let ignoreStartFound = false

        ignoreObjectsArray.forEach((ignoreObject) => {
            if(i === ignoreObject.ignoreStart){
                ignoreStartFound = true
                return
            }
        })
        if(ignoreStartFound){
            // we are now adding everything
            // unless we find an ignoreEnd
            let ignoreEndFound = false
            for (let j = i; j < stringToMinify.length; j++){
                ignoreObjectsArray.forEach((ignoreObject) => {
                    if(j === ignoreObject.ignoreEnd){
                        ignoreEndFound = true
                        return
                    }
                })
                if(ignoreEndFound){
                    i = j
                    break
                } else{
                    minifiedString += stringToMinify[j]
                    minifiedArray.push(stringToMinify[j])
                }
            }
        }

        // otherwise carry out normal minification
        // handle new lines single character
        if(stringToMinify[i] === '\n'){
            
            minifiedString += ' '
            minifiedArray.push(' ')
            // console.log('hello from line break')
            // console.log(minifiedString)
            continue
        }
        // // handle new lines escape character
        if(stringToMinify[i] === '\\' && stringToMinify[i+1] === 'n'){
            minifiedString += ' '
            i++
            continue
        }
        // handle tabs single character
        if(stringToMinify[i] === '\t'){
            minifiedString += ' '
            continue
        }
        // handle tabs escape character
        if(stringToMinify[i] === '\\' && stringToMinify[i+1] === 't'){
            minifiedString += ' '
            i++
            continue
        }

        // handle carriage returns
        if(stringToMinify[i] === '\r'){
            minifiedString += ' '
            continue
        }

        if(stringToMinify[i] === '\\' && stringToMinify[i+1] === 'r'){
            minifiedString +=' '
            i++
            continue
        }

        minifiedString += stringToMinify[i]
        // minifiedArray.push(stringToMinify[i])
        // console.log(minifiedArray)

        // const newMinifiedString = minifiedArray.join('')
        // console.log(minifiedString)
    }
    return minifiedString
}

const removeTrailingSpacesWithIgnores = (stringToMinify, ignoreObjectsArray ) => {

    
    let minifiedString = ''

    let previousCharSpace = false


    for (let i = 0; i < stringToMinify.length; i++){
        // check if i is === to ignoreStart
        let ignoreStartFound = false

        ignoreObjectsArray.forEach((ignoreObject) => {
            if(i === ignoreObject.ignoreStart){
                ignoreStartFound = true
                return
            }
        })
        if(ignoreStartFound){
            // we are now adding everything
            // unless we find an ignoreEnd
            let ignoreEndFound = false
            for (let j = i; j < stringToMinify.length; j++){
                ignoreObjectsArray.forEach((ignoreObject) => {
                    if(j === ignoreObject.ignoreEnd){
                        ignoreEndFound = true
                        return
                    }
                })
                if(ignoreEndFound){
                    i = j
                    break
                } else{
                    minifiedString += stringToMinify[j]
                }
            }
        }

        // otherwise carry out normal minification

        if(stringToMinify[i] === ' ' && previousCharSpace){
            // dont include the space
            continue
        } 
        if(stringToMinify[i] === ' '){
            // do include the space - but set previous space flag to true
            previousCharSpace = true
            minifiedString += stringToMinify[i]
            continue
        }

        previousCharSpace = false
        minifiedString += stringToMinify[i]


    }
    return minifiedString
}


// let ignoreSpots = identifyIgnoreSpots(codeBody)
// console.log(minifyWithIgnores(codeBody, identifyIgnoreSpots(codeBody) ))
// let codeToIgnoreSpaces = minifyWithIgnores(codeBody, ignoreSpots )
// console.log(removeTrailingSpacesWithIgnores(codeToIgnoreSpaces, ignoreSpots))




const fullMinifyCode = (codeToMinify) => {

    let ignoreSpots = identifyIgnoreSpots(codeToMinify)
    let codeToIgnoreSpaces = minifyWithIgnores(codeToMinify, ignoreSpots)
    // console.log(codeToIgnoreSpaces)
    let newIgnores = identifyIgnoreSpots(codeToIgnoreSpaces)
    let minifiedCodeToReturn = removeTrailingSpacesWithIgnores(codeToIgnoreSpaces, newIgnores)

    return minifiedCodeToReturn

}

// console.log(fullMinifyCode(codeBody))

module.exports = { minifyCode, removeTrailingSpacesMinify, fullMinifyCode }


