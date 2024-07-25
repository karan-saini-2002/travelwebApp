document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');
  
    if (packageId) {
      fetch(`http://localhost:5000/api/package/${packageId}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then(packageData => {
          console.log('Fetched package data:', packageData);
  
          // Populate form fields with package data
          document.getElementById('packageId').value = packageData._id;
          document.getElementById('destination').value = packageData.destination;
          document.getElementById('name').value = packageData.name;
          document.getElementById('duration').value = packageData.duration;
          document.getElementById('flightDetails').value = packageData.flights.details;
          document.getElementById('flightNumber').value = packageData.flights.flightNumber;
          document.getElementById('departureDate').value = formatDateTime(packageData.flights.departureDate);
          document.getElementById('returnDate').value = formatDateTime(packageData.flights.returnDate);
          document.getElementById('hotelDetails').value = packageData.hotels.details;
          document.getElementById('hotelName').value = packageData.hotels.name;
          document.getElementById('hotelAddress').value = packageData.hotels.address;
          document.getElementById('checkIn').value = formatDateTime(packageData.hotels.checkIn);
          document.getElementById('checkOut').value = formatDateTime(packageData.hotels.checkOut);
          document.getElementById('bookingDetails').value = packageData.hotels.bookingDetails;
          document.getElementById('transfers').value = packageData.transfers;
          document.getElementById('activityName1').value = packageData.activities[0].name;
          document.getElementById('activityImg1').value = packageData.activities[0].img;
          document.getElementById('activityDescription1').value = packageData.activities[0].description;
          document.getElementById('activityName2').value = packageData.activities[1].name;
          document.getElementById('activityImg2').value = packageData.activities[1].img;
          document.getElementById('activityDescription2').value = packageData.activities[1].description;
          document.getElementById('activityName3').value = packageData.activities[2].name;
          document.getElementById('activityImg3').value = packageData.activities[2].img;
          document.getElementById('activityDescription3').value = packageData.activities[2].description;
          document.getElementById('day1').value = packageData.itinerary[0].day;
          document.getElementById('date1').value = formatDateTime(packageData.itinerary[0].date);
          document.getElementById('hotel1').value = packageData.itinerary[0].hotel;
          document.getElementById('hotelStars1').value = packageData.itinerary[0].hotelStars;
          document.getElementById('car1').value = packageData.itinerary[0].car;
          document.getElementById('sightseeing1').value = packageData.itinerary[0].sightseeing;
          document.getElementById('day2').value = packageData.itinerary[1].day;
          document.getElementById('date2').value = formatDateTime(packageData.itinerary[1].date);
          document.getElementById('hotel2').value = packageData.itinerary[1].hotel;
          document.getElementById('hotelStars2').value = packageData.itinerary[1].hotelStars;
          document.getElementById('car2').value = packageData.itinerary[1].car;
          document.getElementById('sightseeing2').value = packageData.itinerary[1].sightseeing;
          document.getElementById('day3').value = packageData.itinerary[2].day;
          document.getElementById('date3').value = formatDateTime(packageData.itinerary[2].date);
          document.getElementById('hotel3').value = packageData.itinerary[2].hotel;
          document.getElementById('hotelStars3').value = packageData.itinerary[2].hotelStars;
          document.getElementById('car3').value = packageData.itinerary[2].car;
          document.getElementById('sightseeing3').value = packageData.itinerary[2].sightseeing;
          document.getElementById('meals').value = packageData.meals;
          document.getElementById('price').value = packageData.price;
          document.getElementById('img').value = packageData.img;
          document.getElementById('additionalImg').value = packageData.additionalImg.join(', ');
        })
        .catch(error => {
          console.error('Error fetching package data:', error);
         
        });
    } else {
      console.error('Package ID parameter not found in URL');
      alert('Package ID not found in URL. Cannot load package data for editing.');
    }
  
    document.getElementById('editPackageForm').addEventListener('submit', (event) => {
      event.preventDefault();
  
      const packageData = {
        _id: document.getElementById('packageId').value,
        destination: document.getElementById('destination').value,
        name: document.getElementById('name').value,
        duration: document.getElementById('duration').value,
        flights: {
          details: document.getElementById('flightDetails').value,
          flightNumber: document.getElementById('flightNumber').value,
          departureDate: document.getElementById('departureDate').value,
          returnDate: document.getElementById('returnDate').value
        },
        hotels: {
          details: document.getElementById('hotelDetails').value,
          name: document.getElementById('hotelName').value,
          address: document.getElementById('hotelAddress').value,
          checkIn: document.getElementById('checkIn').value,
          checkOut: document.getElementById('checkOut').value,
          bookingDetails: document.getElementById('bookingDetails').value
        },
        transfers: document.getElementById('transfers').value,
        activities: [
          {
            name: document.getElementById('activityName1').value,
            img: document.getElementById('activityImg1').value,
            description: document.getElementById('activityDescription1').value
          },
          {
            name: document.getElementById('activityName2').value,
            img: document.getElementById('activityImg2').value,
            description: document.getElementById('activityDescription2').value
          },
          {
            name: document.getElementById('activityName3').value,
            img: document.getElementById('activityImg3').value,
            description: document.getElementById('activityDescription3').value
          }
        ],
        itinerary: [
          {
            day: document.getElementById('day1').value,
            date: document.getElementById('date1').value,
            hotel: document.getElementById('hotel1').value,
            hotelStars: document.getElementById('hotelStars1').value,
            car: document.getElementById('car1').value,
            sightseeing: document.getElementById('sightseeing1').value
          },
          {
            day: document.getElementById('day2').value,
            date: document.getElementById('date2').value,
            hotel: document.getElementById('hotel2').value,
            hotelStars: document.getElementById('hotelStars2').value,
            car: document.getElementById('car2').value,
            sightseeing: document.getElementById('sightseeing2').value
          },
          {
            day: document.getElementById('day3').value,
            date: document.getElementById('date3').value,
            hotel: document.getElementById('hotel3').value,
            hotelStars: document.getElementById('hotelStars3').value,
            car: document.getElementById('car3').value,
            sightseeing: document.getElementById('sightseeing3').value
          }
        ],
        meals: document.getElementById('meals').value,
        price: document.getElementById('price').value,
        img: document.getElementById('img').value,
        additionalImg: document.getElementById('additionalImg').value.split(',').map(img => img.trim())
      };
  
      fetch(`http://localhost:5000/api/package/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(packageData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
          }
          return response.json();
        })
        .then(updatedPackage => {
          console.log('Package updated successfully:', updatedPackage);
          alert('Package updated successfully');
        })
        .catch(error => {
          console.error('Error updating package:', error);
          alert('Error updating package. Please try again later.');
        });
    });
  });
  
  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  