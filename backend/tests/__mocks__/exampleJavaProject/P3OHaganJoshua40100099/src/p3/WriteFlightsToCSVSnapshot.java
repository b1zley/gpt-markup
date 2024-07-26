package p3;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalTime;
import java.util.List;
import java.util.Queue;

/**
 * class for multithreading a write to csv event
 * seeks out the current time - and names the csv file according to business rules
 */
public class WriteFlightsToCSVSnapshot implements Runnable {

	private List<CommercialFlight> commercialFlightList;
	
	private BoardingStatus targetBoardingStatus;
	
	@Override
	public void run() {
		
		Queue<CommercialFlight> closedCommercialFlightQueue = DeparturesControl.generateQueueByBoardingStatus(commercialFlightList, targetBoardingStatus);
		
		// some localtime logic
		LocalTime now = LocalTime.now();
		
		int hours = now.getHour();
		int mins = now.getMinute();
		int secs = now.getSecond();
		
		StringBuilder sb = new StringBuilder();
		
		String fileNameSeparator = "_";
		
		sb.append(targetBoardingStatus.toString());
		sb.append(fileNameSeparator);
		
		sb.append(hours);
		sb.append(mins);
		sb.append(secs);
		sb.append(".csv");
		
		String fileName = sb.toString();
		
		
		writeQueueToFile(closedCommercialFlightQueue, fileName);
		
		

	}
	/**
	 * method which writes to file at target csv - all elements of a commercial flight queue
	 * @param commercialFlightQueue - queue to be written
	 * @param fileName - target file name
	 */
	private void writeQueueToFile(Queue<CommercialFlight> commercialFlightQueue, String fileName) {
	
		File file = new File(fileName);
		
		FileWriter fw;
		try {
			fw = new FileWriter(file);

			BufferedWriter bw = new BufferedWriter(fw);
			
			// handle column names
			String separator = ",";
			String newLine = "\n";
			
			StringBuilder sb = new StringBuilder();
			
			sb.append("Flight Number");
			sb.append(separator);
			
			sb.append("Destination");
			sb.append(separator);
			
			sb.append("DepartureTime");
			sb.append(newLine);
			
			bw.write(sb.toString());
			
			// control queue release of data based on whether queue is empty
			// and whether thread is interrupted
			
			// if thread is interrupted - exit while loop and close resources
			while(!commercialFlightQueue.isEmpty() && !Thread.currentThread().isInterrupted()) {
				// reset and reuse stringbuilder object
				sb.setLength(0);
				
				CommercialFlight commercialFlight = commercialFlightQueue.poll();
				
				String flightNumber = commercialFlight.getFlightNumber();
				String destination = commercialFlight.getDestination();
				
				LocalTime deptTime = commercialFlight.getDepartureTime();
				
				int hours = deptTime.getHour();
				int mins = deptTime.getMinute();
				
				
				sb.append(flightNumber);
				sb.append(separator);
				
				sb.append(destination);
				sb.append(separator);
				
				sb.append(deptTime.toString());
				sb.append(newLine);
				
				bw.write(sb.toString());
			}
			bw.close();
			fw.close();
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	
		
	}
	/**
	 * method which writes to target csv a snapshot of the current departure lsit, according to a boarding status
	 * @param commercialFlightList - flight list to search across and print to csv
	 * @param targetBoardingStatus - boardingStatusSearchKey - only flight boarding statusses matching this boarding status will be entered into the file
	 */
	public WriteFlightsToCSVSnapshot(List<CommercialFlight> commercialFlightList, BoardingStatus targetBoardingStatus) {
		
		this.commercialFlightList = commercialFlightList;
		this.targetBoardingStatus = targetBoardingStatus;
	}
	
	
	

}
