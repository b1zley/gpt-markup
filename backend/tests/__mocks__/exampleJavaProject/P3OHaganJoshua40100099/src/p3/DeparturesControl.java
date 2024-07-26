package p3;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Scanner;
import java.util.Set;
import java.util.TreeMap;

/**
 * class which contains series of methods for handling departure control in an airport
 */
public class DeparturesControl {

	/**
	 * csv file name to read in
	 */
	private static final String FILE_NAME = "Departures.csv";

	/**
	 * entry point for program
	 * @param args
	 */
	public static void main(String[] args) {

		// lets accept only commercial flights initially
		List<CommercialFlight> commercialFlightList = new ArrayList<CommercialFlight>();

		List<String> flightPrefixesToIgnore = List.of("m");

		readData(commercialFlightList, FILE_NAME, flightPrefixesToIgnore);

		showMenu(commercialFlightList);

	}

	/**
	 * displays a user friendly menu to the user - which provides a series of options
	 * depending on the users selection - will execute requisite methods which effect/display
	 * an list of commercialFlights passed as argument
	 * @param commercialFlightList - List<CommercialFlight> - flightList to be modified/displayed
	 */
	private static void showMenu(List<CommercialFlight> commercialFlightList) {
		Scanner sc = new Scanner(System.in);

		String userInput;
		int userInputInt;

		do {
			// output options to screen
			System.out.println("1. Display daily schedule departures (oredered by time) - time relative");
			System.out.println("2. Delay flight - STU904 until 22:15");
			System.out.println("3. Destination Country Analysis");
			System.out.println("4. Add Flight : BAA1234,British Airways,23:30,London,LHR,UK,B12,Not Started, 231");
			System.out.println("5. Write to file (all flights with CLOSED boarding status )");
			System.out.println("6. Quit");
			System.out.println("Enter option...");

			userInput = sc.nextLine();

			try {
				// could do this whole thing as a oner but capture and convert i think is more
				// readable

				userInputInt = Integer.valueOf(userInput);
			} catch (Exception e) {
				// default value to retstart menu
				userInputInt = -1000;
			}

			// switch on userInputInt for option selection

			switch (userInputInt) {
			case 1:
				// just going to be lazy and sort the list - may later create a method which returns a sorted list
				
				// now to override the to string which is called in displayAllFlights
				// will create a comparator on flights rather than commercial flights bc flights and commercial flights 
				// have departure times
				Collections.sort(commercialFlightList, new FlightComparatorTimeAsc());
				displayAllFlights(commercialFlightList);
				break;
			case 2:
				String flightNumberToDelay = "STU904";
				LocalTime delayTime = LocalTime.of(22,15);
				delayFlightNumberToTime(commercialFlightList,flightNumberToDelay, delayTime);
				break;
			case 3:
				
				displayAnalysisByCountry(commercialFlightList);
				break;
			case 4:
				
				CommercialFlight flightToAdd = new CommercialFlight("BAA1234", "British Airways", LocalTime.of(22, 30), "London", "UK", "B12", "LHR", BoardingStatus.NOT_STARTED, 231);
				commercialFlightList.add(flightToAdd);
				
				System.out.println("Flight added");
				
				System.out.println(flightToAdd.toString());
				break;
			case 5:
				
				
				
				Thread thread = new Thread(new WriteFlightsToCSVSnapshot(commercialFlightList, BoardingStatus.CLOSED));
				thread.start();
				break;
			case 6:
				System.out.println("Quit selected - exitting");
				break;
			default:
				System.out.println("Invalid input detected! Please select one of the following choices :");
				break;

			}

		} while (userInputInt != 6);

		
		//close the scanner resource
		sc.close();
	}

	
	// give protected status for access in runnable write class
	/**
	 * generates a queue of commercialflights based on all elements of a passed list which match a boarding status search key
	 * 
	 * @param commercialFlightList - List<CommercialFlight> to be searched 
	 * @param boardingStatusSearchKey - BoardingStatus - searchKey for lsit
	 * @return - queue of commercialflights with matching boardingstatus search key
	 */
	protected static Queue<CommercialFlight> generateQueueByBoardingStatus(List<CommercialFlight> commercialFlightList,
			BoardingStatus boardingStatusSearchKey) {
		Queue<CommercialFlight> commercialFlightQueue = new LinkedList<CommercialFlight>();
		
		
		for(CommercialFlight commercialFlight : commercialFlightList) {
			
			BoardingStatus boardingStatus = commercialFlight.getBoardingStatus();
			
			if(boardingStatus == boardingStatusSearchKey) {
				
				commercialFlightQueue.add(commercialFlight);
				
			}
			
		}
		
		
		return commercialFlightQueue;
	}

	/**
	 * analyses a passed list of commercial flights and displays the frequency of each country in the list
	 * @param commercialFlightList - flight list to be searched and displayed from
	 */
	private static void displayAnalysisByCountry(List<CommercialFlight> commercialFlightList) {
		
		
		
		Map<String, Integer> countryToCount  = new TreeMap<String, Integer>();
		
		
		for(CommercialFlight commercialFlight : commercialFlightList) {
			
			String country = commercialFlight.getCountry();
			
			int countToPut;
			if(countryToCount.containsKey(country)) {
				countToPut = countryToCount.get(country) + 1;
				countryToCount.put(country, countToPut);
				
				
			} else {
				countToPut = 1;
				countryToCount.put(country, countToPut);
			}	
		}
		
		
		Set<String> countryNames = countryToCount.keySet();
		
		// figure out formatting later
		for (String countryName : countryNames) {
			int count = countryToCount.get(countryName);
			
			
			System.out.println(countryName + "\t: " + count);
			
			
		}
		
		
	}

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

}
