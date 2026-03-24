import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Integrate core authentication component
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type ScanRecord = {
    id : Nat;
    plantName : Text;
    diseaseDetected : Text;
    severity : {
      #low;
      #medium;
      #high;
    };
    treatmentRecommendation : Text;
    preventionTips : Text;
    scanDate : Time.Time;
    imageRef : Text;
  };

  module ScanRecord {
    public func compare(a : ScanRecord, b : ScanRecord) : Order.Order {
      Int.compare(b.scanDate, a.scanDate);
    };
  };

  public type UserProfile = {
    name : Text;
    location : Text;
    totalScanCount : Nat;
  };

  // State
  var nextScanId = 1;
  let scanHistory = Map.empty<Principal, [ScanRecord]>();
  let profiles = Map.empty<Principal, UserProfile>();

  // Required profile management functions per instructions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // Add new scan record
  public shared ({ caller }) func addScanRecord(record : ScanRecord) : async ScanRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add scan records");
    };

    let scanWithId = {
      id = nextScanId;
      plantName = record.plantName;
      diseaseDetected = record.diseaseDetected;
      severity = record.severity;
      treatmentRecommendation = record.treatmentRecommendation;
      preventionTips = record.preventionTips;
      scanDate = Time.now();
      imageRef = record.imageRef;
    };
    nextScanId += 1;

    // Update scan history
    let userHistory = switch (scanHistory.get(caller)) {
      case (null) { [scanWithId] };
      case (?history) { history.concat([scanWithId]) };
    };
    scanHistory.add(caller, userHistory);

    // Update profile scan count
    switch (profiles.get(caller)) {
      case (null) {
        let newProfile : UserProfile = {
          name = "";
          location = "";
          totalScanCount = 1;
        };
        profiles.add(caller, newProfile);
      };
      case (?profile) {
        let updatedProfile = {
          profile with
          totalScanCount = profile.totalScanCount + 1;
        };
        profiles.add(caller, updatedProfile);
      };
    };

    scanWithId;
  };

  // Get current user's scan history
  public query ({ caller }) func getScanHistory() : async [ScanRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view scan history");
    };
    switch (scanHistory.get(caller)) {
      case (null) { [] };
      case (?history) { history.sort() };
    };
  };
};
