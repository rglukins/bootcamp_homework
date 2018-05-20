
# coding: utf-8

# # PyAcademy Analysis
# 
# * Charter schools easily outperformed district schools.  The top five performing schools by overall pass rate are charter schools. They also had higher average scores and higher pass rates in math and reading.  Charter schools seem particularly superior to district schools in teaching math.
# 
# 
# * Schools that spend less per student surprisingly outperform schools that spend more on both average scores in reading and math and the percentage of students who pass those subjects.  Higher per student spending does not correlate with improved learning outcomes.
# 
# 
# * Schools with smaller enrollments tend to outperform larger schools, as the average scores and the pass rates decrease with larger enrollments.  Large district schools really seem to struggle with math and reading, but particularly with math.

# In[28]:


#import dependencies
import pandas as pd


# In[29]:


#create file paths
school_file = "raw_data/schools_complete.csv"
students_file = "raw_data/students_complete.csv"


# In[30]:


#read data into a pandas dataset
schools_df = pd.read_csv(school_file)
students_df = pd.read_csv(students_file)


# In[31]:


#start district summary by finding the total number of schools
total_schools = schools_df["name"].count()


# In[32]:


#district summary--find the total number of students in the district
total_students = students_df["name"].count()


# In[33]:


#district analysis -- find total budget
total_budget = schools_df["budget"].sum()


# In[34]:


#district analysis -- calculate the average scores for reading and math 
district_average_reading = students_df["reading_score"].mean()
district_average_math = students_df["math_score"].mean()


# In[35]:


#calculate the total passing in math
pass_count_math = students_df[students_df["math_score"] > 69].count()
pass_count_math = pass_count_math["math_score"]


# In[36]:


#calculate the total passing in reading
pass_count_reading = students_df[students_df["reading_score"] > 69].count()
pass_count_reading = pass_count_reading["reading_score"]


# In[37]:


#districct analysis -- calculate the percentage passing in reading and math
percent_passing_reading = pass_count_reading / total_students
percent_passing_math = pass_count_math / total_students


# In[38]:


#calculate the overall passing rate
overall_pass = (percent_passing_math + percent_passing_reading) / 2


# In[39]:


#create a summary table of the district's key metrics
district_summary_table = pd.DataFrame(
    {
        "Total Schools": '{:,.0f}'.format(total_schools),
        "Total Students": '{:,.0f}'.format(total_students),
        "Total Budget": '${:,.2f}'.format(total_budget),                              
        "Average Math Score": '{:,.2f}'.format(district_average_math),
        "Average Reading Score": '{:,.2f}'.format(district_average_reading),
        "% Passing Math":'{:.2%}'.format(percent_passing_math),
        "% Passing Reading":'{:.2%}'.format(percent_passing_reading),
        "Overall Passing Rate": '{:.2%}'.format(overall_pass)
    }, index=[0])
district_summary_table = district_summary_table[["Total Schools","Total Students","Total Budget", "Average Math Score","Average Reading Score","% Passing Math","% Passing Reading","Overall Passing Rate"]]


# # District Summary

# In[40]:


district_summary_table


# In[41]:


#District Summary complete
#Begin analysis of the individual schools
#build upon the schools_df by adding the summary columns from the students_df


# In[42]:


students_df = students_df.rename(columns={"name": "Student Name", "school": "School Name"})


# In[43]:


#rename the "size" in the table to total students
schools_summary_table = schools_df.rename(columns={"name": "School Name", 'type': "School Type", 'size': 'Total Students', 'budget': "Total Budget"})


# In[44]:


#calculate the budge per student and append a column to the summary table
schools_summary_table["Per Student Budget"] = schools_summary_table["Total Budget"] / schools_summary_table["Total Students"]


# In[45]:


#calculate the average scores for each school
#group the student_df by school and check the .mean() method
#test--create new dataframe from groupby object
df = pd.DataFrame(students_df.groupby("School Name").mean())
df = df.reset_index()


# In[46]:


schools_summary_table = pd.merge(schools_summary_table, df, on="School Name")
schools_summary_table = schools_summary_table.rename(columns={"reading_score": "Average Reading Score", "math_score": "Average Math Score"})


# In[47]:


#Calculate the number of students who passed reading (for calculating the percent pass later)
df2 = students_df[["School Name", "reading_score"]]
df2 = df2.loc[df2["reading_score"] > 69]
df2 = df2.groupby("School Name").count()
df2 = df2.rename(columns={"reading_score": "# of Pass Reading"})
df2 = df2.reset_index()


# In[48]:


#Calculate the number of students who passed math (for calculating the percent pass later)
df3 = students_df[["School Name", "math_score"]]
df3 = df3.loc[df3["math_score"] > 69]
df3 = df3.groupby("School Name").count()
df3 = df3.rename(columns={"math_score": "# of Pass Math"})
df3 = df3.reset_index()


# In[49]:


#merge the #'s passed dataframes with the summary df in order to perform calculations
schools_summary_table = pd.merge(schools_summary_table, df2, on="School Name")
schools_summary_table = pd.merge(schools_summary_table, df3, on="School Name")


# In[50]:


#Calculate the passing % for math and reading using the columns in the dataframe and add them as new columns
schools_summary_table["% Passing Reading"] = (schools_summary_table["# of Pass Reading"] / schools_summary_table["Total Students"]) * 100
schools_summary_table["% Passing Math"] = (schools_summary_table["# of Pass Math"] / schools_summary_table["Total Students"]) * 100
schools_summary_table["Overall Passing Rate"] = ((schools_summary_table["% Passing Reading"] + schools_summary_table["% Passing Math"]) / 2) 


# In[51]:


#drop the unnecessary columns from the summary dataframe
schools_summary_table = schools_summary_table.drop(["School ID", "# of Pass Reading", "# of Pass Math", "Student ID"], axis=1)


# # Schools Summary 

# In[26]:


schools_summary_table


# In[276]:


# Summary Table for Individual Schools complete
# Begin creating table for the top 5 performing schools based on overall pass rate


# In[277]:


# sort the summary dataframe in order to create a df in which the top five schools are on the top
top5 = schools_summary_table.sort_values("Overall Passing Rate", ascending=False).reset_index(drop=True)
top5 = top5.iloc[0:5].set_index("School Name")


# In[278]:


# sort the summary dataframe in order to create a df in which the bottom five schools are on the top
bottom5 = schools_summary_table.sort_values("Overall Passing Rate", ascending=True).reset_index(drop=True)
bottom5 = bottom5.iloc[0:5].set_index("School Name")


# In[279]:


#top and bottom 5 tables complete
#create table that sorts math scores by school and grade level


# In[280]:


#Create table for math scores by grade
math_scores_by_grade = students_df.groupby(["School Name", "grade"])["math_score"].mean()
math_scores_by_grade = pd.DataFrame(math_scores_by_grade).unstack()


# In[281]:


#create table for reading scores by grade
reading_scores_by_grade = students_df.groupby(["School Name", "grade"])["reading_score"].mean()
reading_scores_by_grade = pd.DataFrame(reading_scores_by_grade).unstack("grade")


# In[282]:


#create table for scores by school spending
scores_by_spending = schools_summary_table
#create bins and bin lables
bins = [0, 600, 620, 640, 655]
spending_ranges = ["Under $600", "$600-620", "$620-640", "Over $640"]
#create new column for the binned data
scores_by_spending["Spending Ranges (Per Student)"] = pd.cut(scores_by_spending["Per Student Budget"], bins, labels=spending_ranges)
#group the df by the binned column and create new df for it
scores_by_spending = scores_by_spending.groupby("Spending Ranges (Per Student)").mean()
#drop the irrelevant columns from the df
scores_by_spending = scores_by_spending.drop(["Total Students", "Total Budget", "Per Student Budget"], axis=1)


# In[283]:


#create table for scores by school size
scores_by_size = schools_summary_table
#create bins and bin lables
bins = [0, 1500, 3000, 5000]
enrollments = ["Small(Under 1500)", "Medium(1500-3000)", "Large (Over 3000)"]
#create new column for the binned data
scores_by_size["Enrollments"] = pd.cut(scores_by_size["Total Students"], bins, labels=enrollments)
#group the df by the binned column and create new df for it
scores_by_size = scores_by_size.groupby("Enrollments").mean()
#drop the irrelevant columns from the df
scores_by_size = scores_by_size.drop(["Total Students", "Total Budget", "Per Student Budget"], axis=1)


# In[284]:


#create a table for scores by school type
scores_by_type = schools_summary_table
scores_by_type = scores_by_type.groupby("School Type").mean()
scores_by_type = scores_by_type.drop(["Total Students", "Total Budget", "Per Student Budget"], axis=1)


# In[181]:


#Data wrangling complete. Now display the tables.


# # Top 5 Performing Schools

# In[185]:


top5


# # Bottom 5 Performing Schools

# In[186]:


bottom5


# # Math Scores By Grade

# In[187]:


math_scores_by_grade


# # Reading Scores By Grade

# In[188]:


reading_scores_by_grade


# # Math and Reading Scores by Spending (Per Student)

# In[189]:


scores_by_spending


# # Math and Reading Scores by School Size

# In[190]:


scores_by_size


# # Math and Reading Scores by Type of School

# In[191]:


scores_by_type

