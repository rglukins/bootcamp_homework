
# PyAcademy Analysis

* Charter schools easily outperformed district schools.  The top five performing schools by overall pass rate are charter schools. They also had higher average scores and higher pass rates in math and reading.  Charter schools seem particularly superior to district schools in teaching math.


* Schools that spend less per student surprisingly outperform schools that spend more on both average scores in reading and math and the percentage of students who pass those subjects.  Higher per student spending does not correlate with improved learning outcomes.


* Schools with smaller enrollments tend to outperform larger schools, as the average scores and the pass rates decrease with larger enrollments.  Large district schools really seem to struggle with math and reading, but particularly with math.


```python
#import dependencies
import pandas as pd
```


```python
#create file paths
school_file = "raw_data/schools_complete.csv"
students_file = "raw_data/students_complete.csv"
```


```python
#read data into a pandas dataset
schools_df = pd.read_csv(school_file)
students_df = pd.read_csv(students_file)
```


```python
#start district summary by finding the total number of schools
total_schools = schools_df["name"].count()
```


```python
#district summary--find the total number of students in the district
total_students = students_df["name"].count()
```


```python
#district analysis -- find total budget
total_budget = schools_df["budget"].sum()
```


```python
#district analysis -- calculate the average scores for reading and math 
district_average_reading = students_df["reading_score"].mean()
district_average_math = students_df["math_score"].mean()
```


```python
#calculate the total passing in math
pass_count_math = students_df[students_df["math_score"] > 69].count()
pass_count_math = pass_count_math["math_score"]
```


```python
#calculate the total passing in reading
pass_count_reading = students_df[students_df["reading_score"] > 69].count()
pass_count_reading = pass_count_reading["reading_score"]
```


```python
#districct analysis -- calculate the percentage passing in reading and math
percent_passing_reading = pass_count_reading / total_students
percent_passing_math = pass_count_math / total_students
```


```python
#calculate the overall passing rate
overall_pass = (percent_passing_math + percent_passing_reading) / 2
```


```python
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

```

# District Summary


```python
district_summary_table
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Total Schools</th>
      <th>Total Students</th>
      <th>Total Budget</th>
      <th>Average Math Score</th>
      <th>Average Reading Score</th>
      <th>% Passing Math</th>
      <th>% Passing Reading</th>
      <th>Overall Passing Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>15</td>
      <td>39,170</td>
      <td>$24,649,428.00</td>
      <td>78.99</td>
      <td>81.88</td>
      <td>74.98%</td>
      <td>85.81%</td>
      <td>80.39%</td>
    </tr>
  </tbody>
</table>
</div>




```python
#District Summary complete
#Begin analysis of the individual schools
#build upon the schools_df by adding the summary columns from the students_df
```


```python
students_df = students_df.rename(columns={"name": "Student Name", "school": "School Name"})
```


```python
#rename the "size" in the table to total students
schools_summary_table = schools_df.rename(columns={"name": "School Name", 'type': "School Type", 'size': 'Total Students', 'budget': "Total Budget"})
```


```python
#calculate the budge per student and append a column to the summary table
schools_summary_table["Per Student Budget"] = schools_summary_table["Total Budget"] / schools_summary_table["Total Students"]
```


```python
#calculate the average scores for each school
#group the student_df by school and check the .mean() method
#test--create new dataframe from groupby object
df = pd.DataFrame(students_df.groupby("School Name").mean())
df = df.reset_index()
```


```python
schools_summary_table = pd.merge(schools_summary_table, df, on="School Name")
schools_summary_table = schools_summary_table.rename(columns={"reading_score": "Average Reading Score", "math_score": "Average Math Score"})
```


```python
#Calculate the number of students who passed reading (for calculating the percent pass later)
df2 = students_df[["School Name", "reading_score"]]
df2 = df2.loc[df2["reading_score"] > 69]
df2 = df2.groupby("School Name").count()
df2 = df2.rename(columns={"reading_score": "# of Pass Reading"})
df2 = df2.reset_index()
```


```python
#Calculate the number of students who passed math (for calculating the percent pass later)
df3 = students_df[["School Name", "math_score"]]
df3 = df3.loc[df3["math_score"] > 69]
df3 = df3.groupby("School Name").count()
df3 = df3.rename(columns={"math_score": "# of Pass Math"})
df3 = df3.reset_index()
```


```python
#merge the #'s passed dataframes with the summary df in order to perform calculations
schools_summary_table = pd.merge(schools_summary_table, df2, on="School Name")
schools_summary_table = pd.merge(schools_summary_table, df3, on="School Name")
```


```python
#Calculate the passing % for math and reading using the columns in the dataframe and add them as new columns
schools_summary_table["% Passing Reading"] = (schools_summary_table["# of Pass Reading"] / schools_summary_table["Total Students"]) * 100
schools_summary_table["% Passing Math"] = (schools_summary_table["# of Pass Math"] / schools_summary_table["Total Students"]) * 100
schools_summary_table["Overall Passing Rate"] = ((schools_summary_table["% Passing Reading"] + schools_summary_table["% Passing Math"]) / 2) 
```


```python
#drop the unnecessary columns from the summary dataframe
schools_summary_table = schools_summary_table.drop(["School ID", "# of Pass Reading", "# of Pass Math", "Student ID"], axis=1)
```

# Schools Summary 


```python
schools_summary_table
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School Name</th>
      <th>School Type</th>
      <th>Total Students</th>
      <th>Total Budget</th>
      <th>Per Student Budget</th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing Rate</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Huang High School</td>
      <td>District</td>
      <td>2917</td>
      <td>1910635</td>
      <td>655.0</td>
      <td>81.182722</td>
      <td>76.629414</td>
      <td>81.316421</td>
      <td>65.683922</td>
      <td>73.500171</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Figueroa High School</td>
      <td>District</td>
      <td>2949</td>
      <td>1884411</td>
      <td>639.0</td>
      <td>81.158020</td>
      <td>76.711767</td>
      <td>80.739234</td>
      <td>65.988471</td>
      <td>73.363852</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Shelton High School</td>
      <td>Charter</td>
      <td>1761</td>
      <td>1056600</td>
      <td>600.0</td>
      <td>83.725724</td>
      <td>83.359455</td>
      <td>95.854628</td>
      <td>93.867121</td>
      <td>94.860875</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Hernandez High School</td>
      <td>District</td>
      <td>4635</td>
      <td>3022020</td>
      <td>652.0</td>
      <td>80.934412</td>
      <td>77.289752</td>
      <td>80.862999</td>
      <td>66.752967</td>
      <td>73.807983</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Griffin High School</td>
      <td>Charter</td>
      <td>1468</td>
      <td>917500</td>
      <td>625.0</td>
      <td>83.816757</td>
      <td>83.351499</td>
      <td>97.138965</td>
      <td>93.392371</td>
      <td>95.265668</td>
    </tr>
    <tr>
      <th>5</th>
      <td>Wilson High School</td>
      <td>Charter</td>
      <td>2283</td>
      <td>1319574</td>
      <td>578.0</td>
      <td>83.989488</td>
      <td>83.274201</td>
      <td>96.539641</td>
      <td>93.867718</td>
      <td>95.203679</td>
    </tr>
    <tr>
      <th>6</th>
      <td>Cabrera High School</td>
      <td>Charter</td>
      <td>1858</td>
      <td>1081356</td>
      <td>582.0</td>
      <td>83.975780</td>
      <td>83.061895</td>
      <td>97.039828</td>
      <td>94.133477</td>
      <td>95.586652</td>
    </tr>
    <tr>
      <th>7</th>
      <td>Bailey High School</td>
      <td>District</td>
      <td>4976</td>
      <td>3124928</td>
      <td>628.0</td>
      <td>81.033963</td>
      <td>77.048432</td>
      <td>81.933280</td>
      <td>66.680064</td>
      <td>74.306672</td>
    </tr>
    <tr>
      <th>8</th>
      <td>Holden High School</td>
      <td>Charter</td>
      <td>427</td>
      <td>248087</td>
      <td>581.0</td>
      <td>83.814988</td>
      <td>83.803279</td>
      <td>96.252927</td>
      <td>92.505855</td>
      <td>94.379391</td>
    </tr>
    <tr>
      <th>9</th>
      <td>Pena High School</td>
      <td>Charter</td>
      <td>962</td>
      <td>585858</td>
      <td>609.0</td>
      <td>84.044699</td>
      <td>83.839917</td>
      <td>95.945946</td>
      <td>94.594595</td>
      <td>95.270270</td>
    </tr>
    <tr>
      <th>10</th>
      <td>Wright High School</td>
      <td>Charter</td>
      <td>1800</td>
      <td>1049400</td>
      <td>583.0</td>
      <td>83.955000</td>
      <td>83.682222</td>
      <td>96.611111</td>
      <td>93.333333</td>
      <td>94.972222</td>
    </tr>
    <tr>
      <th>11</th>
      <td>Rodriguez High School</td>
      <td>District</td>
      <td>3999</td>
      <td>2547363</td>
      <td>637.0</td>
      <td>80.744686</td>
      <td>76.842711</td>
      <td>80.220055</td>
      <td>66.366592</td>
      <td>73.293323</td>
    </tr>
    <tr>
      <th>12</th>
      <td>Johnson High School</td>
      <td>District</td>
      <td>4761</td>
      <td>3094650</td>
      <td>650.0</td>
      <td>80.966394</td>
      <td>77.072464</td>
      <td>81.222432</td>
      <td>66.057551</td>
      <td>73.639992</td>
    </tr>
    <tr>
      <th>13</th>
      <td>Ford High School</td>
      <td>District</td>
      <td>2739</td>
      <td>1763916</td>
      <td>644.0</td>
      <td>80.746258</td>
      <td>77.102592</td>
      <td>79.299014</td>
      <td>68.309602</td>
      <td>73.804308</td>
    </tr>
    <tr>
      <th>14</th>
      <td>Thomas High School</td>
      <td>Charter</td>
      <td>1635</td>
      <td>1043130</td>
      <td>638.0</td>
      <td>83.848930</td>
      <td>83.418349</td>
      <td>97.308869</td>
      <td>93.272171</td>
      <td>95.290520</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Summary Table for Individual Schools complete
# Begin creating table for the top 5 performing schools based on overall pass rate
```


```python
# sort the summary dataframe in order to create a df in which the top five schools are on the top
top5 = schools_summary_table.sort_values("Overall Passing Rate", ascending=False).reset_index(drop=True)
top5 = top5.iloc[0:5].set_index("School Name")
```


```python
# sort the summary dataframe in order to create a df in which the bottom five schools are on the top
bottom5 = schools_summary_table.sort_values("Overall Passing Rate", ascending=True).reset_index(drop=True)
bottom5 = bottom5.iloc[0:5].set_index("School Name")
```


```python
#top and bottom 5 tables complete
#create table that sorts math scores by school and grade level
```


```python
#Create table for math scores by grade
math_scores_by_grade = students_df.groupby(["School Name", "grade"])["math_score"].mean()
math_scores_by_grade = pd.DataFrame(math_scores_by_grade).unstack()
```


```python
#create table for reading scores by grade
reading_scores_by_grade = students_df.groupby(["School Name", "grade"])["reading_score"].mean()
reading_scores_by_grade = pd.DataFrame(reading_scores_by_grade).unstack("grade")
```


```python
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
```


```python
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
```


```python
#create a table for scores by school type
scores_by_type = schools_summary_table
scores_by_type = scores_by_type.groupby("School Type").mean()
scores_by_type = scores_by_type.drop(["Total Students", "Total Budget", "Per Student Budget"], axis=1)
```


```python
#Data wrangling complete. Now display the tables.
```

# Top 5 Performing Schools


```python
top5
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School Type</th>
      <th>Total Students</th>
      <th>Total Budget</th>
      <th>Per Student Budget</th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing Rate</th>
    </tr>
    <tr>
      <th>School Name</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Cabrera High School</th>
      <td>Charter</td>
      <td>1858</td>
      <td>1081356</td>
      <td>582.0</td>
      <td>83.975780</td>
      <td>83.061895</td>
      <td>97.039828</td>
      <td>94.133477</td>
      <td>95.586652</td>
    </tr>
    <tr>
      <th>Thomas High School</th>
      <td>Charter</td>
      <td>1635</td>
      <td>1043130</td>
      <td>638.0</td>
      <td>83.848930</td>
      <td>83.418349</td>
      <td>97.308869</td>
      <td>93.272171</td>
      <td>95.290520</td>
    </tr>
    <tr>
      <th>Pena High School</th>
      <td>Charter</td>
      <td>962</td>
      <td>585858</td>
      <td>609.0</td>
      <td>84.044699</td>
      <td>83.839917</td>
      <td>95.945946</td>
      <td>94.594595</td>
      <td>95.270270</td>
    </tr>
    <tr>
      <th>Griffin High School</th>
      <td>Charter</td>
      <td>1468</td>
      <td>917500</td>
      <td>625.0</td>
      <td>83.816757</td>
      <td>83.351499</td>
      <td>97.138965</td>
      <td>93.392371</td>
      <td>95.265668</td>
    </tr>
    <tr>
      <th>Wilson High School</th>
      <td>Charter</td>
      <td>2283</td>
      <td>1319574</td>
      <td>578.0</td>
      <td>83.989488</td>
      <td>83.274201</td>
      <td>96.539641</td>
      <td>93.867718</td>
      <td>95.203679</td>
    </tr>
  </tbody>
</table>
</div>



# Bottom 5 Performing Schools


```python
bottom5
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>School Type</th>
      <th>Total Students</th>
      <th>Total Budget</th>
      <th>Per Student Budget</th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing Rate</th>
    </tr>
    <tr>
      <th>School Name</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Rodriguez High School</th>
      <td>District</td>
      <td>3999</td>
      <td>2547363</td>
      <td>637.0</td>
      <td>80.744686</td>
      <td>76.842711</td>
      <td>80.220055</td>
      <td>66.366592</td>
      <td>73.293323</td>
    </tr>
    <tr>
      <th>Figueroa High School</th>
      <td>District</td>
      <td>2949</td>
      <td>1884411</td>
      <td>639.0</td>
      <td>81.158020</td>
      <td>76.711767</td>
      <td>80.739234</td>
      <td>65.988471</td>
      <td>73.363852</td>
    </tr>
    <tr>
      <th>Huang High School</th>
      <td>District</td>
      <td>2917</td>
      <td>1910635</td>
      <td>655.0</td>
      <td>81.182722</td>
      <td>76.629414</td>
      <td>81.316421</td>
      <td>65.683922</td>
      <td>73.500171</td>
    </tr>
    <tr>
      <th>Johnson High School</th>
      <td>District</td>
      <td>4761</td>
      <td>3094650</td>
      <td>650.0</td>
      <td>80.966394</td>
      <td>77.072464</td>
      <td>81.222432</td>
      <td>66.057551</td>
      <td>73.639992</td>
    </tr>
    <tr>
      <th>Ford High School</th>
      <td>District</td>
      <td>2739</td>
      <td>1763916</td>
      <td>644.0</td>
      <td>80.746258</td>
      <td>77.102592</td>
      <td>79.299014</td>
      <td>68.309602</td>
      <td>73.804308</td>
    </tr>
  </tbody>
</table>
</div>



# Math Scores By Grade


```python
math_scores_by_grade
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="4" halign="left">math_score</th>
    </tr>
    <tr>
      <th>grade</th>
      <th>10th</th>
      <th>11th</th>
      <th>12th</th>
      <th>9th</th>
    </tr>
    <tr>
      <th>School Name</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Bailey High School</th>
      <td>76.996772</td>
      <td>77.515588</td>
      <td>76.492218</td>
      <td>77.083676</td>
    </tr>
    <tr>
      <th>Cabrera High School</th>
      <td>83.154506</td>
      <td>82.765560</td>
      <td>83.277487</td>
      <td>83.094697</td>
    </tr>
    <tr>
      <th>Figueroa High School</th>
      <td>76.539974</td>
      <td>76.884344</td>
      <td>77.151369</td>
      <td>76.403037</td>
    </tr>
    <tr>
      <th>Ford High School</th>
      <td>77.672316</td>
      <td>76.918058</td>
      <td>76.179963</td>
      <td>77.361345</td>
    </tr>
    <tr>
      <th>Griffin High School</th>
      <td>84.229064</td>
      <td>83.842105</td>
      <td>83.356164</td>
      <td>82.044010</td>
    </tr>
    <tr>
      <th>Hernandez High School</th>
      <td>77.337408</td>
      <td>77.136029</td>
      <td>77.186567</td>
      <td>77.438495</td>
    </tr>
    <tr>
      <th>Holden High School</th>
      <td>83.429825</td>
      <td>85.000000</td>
      <td>82.855422</td>
      <td>83.787402</td>
    </tr>
    <tr>
      <th>Huang High School</th>
      <td>75.908735</td>
      <td>76.446602</td>
      <td>77.225641</td>
      <td>77.027251</td>
    </tr>
    <tr>
      <th>Johnson High School</th>
      <td>76.691117</td>
      <td>77.491653</td>
      <td>76.863248</td>
      <td>77.187857</td>
    </tr>
    <tr>
      <th>Pena High School</th>
      <td>83.372000</td>
      <td>84.328125</td>
      <td>84.121547</td>
      <td>83.625455</td>
    </tr>
    <tr>
      <th>Rodriguez High School</th>
      <td>76.612500</td>
      <td>76.395626</td>
      <td>77.690748</td>
      <td>76.859966</td>
    </tr>
    <tr>
      <th>Shelton High School</th>
      <td>82.917411</td>
      <td>83.383495</td>
      <td>83.778976</td>
      <td>83.420755</td>
    </tr>
    <tr>
      <th>Thomas High School</th>
      <td>83.087886</td>
      <td>83.498795</td>
      <td>83.497041</td>
      <td>83.590022</td>
    </tr>
    <tr>
      <th>Wilson High School</th>
      <td>83.724422</td>
      <td>83.195326</td>
      <td>83.035794</td>
      <td>83.085578</td>
    </tr>
    <tr>
      <th>Wright High School</th>
      <td>84.010288</td>
      <td>83.836782</td>
      <td>83.644986</td>
      <td>83.264706</td>
    </tr>
  </tbody>
</table>
</div>



# Reading Scores By Grade


```python
reading_scores_by_grade
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead tr th {
        text-align: left;
    }

    .dataframe thead tr:last-of-type th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr>
      <th></th>
      <th colspan="4" halign="left">reading_score</th>
    </tr>
    <tr>
      <th>grade</th>
      <th>10th</th>
      <th>11th</th>
      <th>12th</th>
      <th>9th</th>
    </tr>
    <tr>
      <th>School Name</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Bailey High School</th>
      <td>80.907183</td>
      <td>80.945643</td>
      <td>80.912451</td>
      <td>81.303155</td>
    </tr>
    <tr>
      <th>Cabrera High School</th>
      <td>84.253219</td>
      <td>83.788382</td>
      <td>84.287958</td>
      <td>83.676136</td>
    </tr>
    <tr>
      <th>Figueroa High School</th>
      <td>81.408912</td>
      <td>80.640339</td>
      <td>81.384863</td>
      <td>81.198598</td>
    </tr>
    <tr>
      <th>Ford High School</th>
      <td>81.262712</td>
      <td>80.403642</td>
      <td>80.662338</td>
      <td>80.632653</td>
    </tr>
    <tr>
      <th>Griffin High School</th>
      <td>83.706897</td>
      <td>84.288089</td>
      <td>84.013699</td>
      <td>83.369193</td>
    </tr>
    <tr>
      <th>Hernandez High School</th>
      <td>80.660147</td>
      <td>81.396140</td>
      <td>80.857143</td>
      <td>80.866860</td>
    </tr>
    <tr>
      <th>Holden High School</th>
      <td>83.324561</td>
      <td>83.815534</td>
      <td>84.698795</td>
      <td>83.677165</td>
    </tr>
    <tr>
      <th>Huang High School</th>
      <td>81.512386</td>
      <td>81.417476</td>
      <td>80.305983</td>
      <td>81.290284</td>
    </tr>
    <tr>
      <th>Johnson High School</th>
      <td>80.773431</td>
      <td>80.616027</td>
      <td>81.227564</td>
      <td>81.260714</td>
    </tr>
    <tr>
      <th>Pena High School</th>
      <td>83.612000</td>
      <td>84.335938</td>
      <td>84.591160</td>
      <td>83.807273</td>
    </tr>
    <tr>
      <th>Rodriguez High School</th>
      <td>80.629808</td>
      <td>80.864811</td>
      <td>80.376426</td>
      <td>80.993127</td>
    </tr>
    <tr>
      <th>Shelton High School</th>
      <td>83.441964</td>
      <td>84.373786</td>
      <td>82.781671</td>
      <td>84.122642</td>
    </tr>
    <tr>
      <th>Thomas High School</th>
      <td>84.254157</td>
      <td>83.585542</td>
      <td>83.831361</td>
      <td>83.728850</td>
    </tr>
    <tr>
      <th>Wilson High School</th>
      <td>84.021452</td>
      <td>83.764608</td>
      <td>84.317673</td>
      <td>83.939778</td>
    </tr>
    <tr>
      <th>Wright High School</th>
      <td>83.812757</td>
      <td>84.156322</td>
      <td>84.073171</td>
      <td>83.833333</td>
    </tr>
  </tbody>
</table>
</div>



# Math and Reading Scores by Spending (Per Student)


```python
scores_by_spending
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing Rate</th>
    </tr>
    <tr>
      <th>Spending Ranges (Per Student)</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Under $600</th>
      <td>83.892196</td>
      <td>83.436210</td>
      <td>96.459627</td>
      <td>93.541501</td>
      <td>95.000564</td>
    </tr>
    <tr>
      <th>$600-620</th>
      <td>84.044699</td>
      <td>83.839917</td>
      <td>95.945946</td>
      <td>94.594595</td>
      <td>95.270270</td>
    </tr>
    <tr>
      <th>$620-640</th>
      <td>82.120471</td>
      <td>79.474551</td>
      <td>87.468080</td>
      <td>77.139934</td>
      <td>82.304007</td>
    </tr>
    <tr>
      <th>Over $640</th>
      <td>80.957446</td>
      <td>77.023555</td>
      <td>80.675217</td>
      <td>66.701010</td>
      <td>73.688113</td>
    </tr>
  </tbody>
</table>
</div>



# Math and Reading Scores by School Size


```python
scores_by_size
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing Rate</th>
    </tr>
    <tr>
      <th>Enrollments</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Small(Under 1500)</th>
      <td>83.892148</td>
      <td>83.664898</td>
      <td>96.445946</td>
      <td>93.497607</td>
      <td>94.971776</td>
    </tr>
    <tr>
      <th>Medium(1500-3000)</th>
      <td>82.822740</td>
      <td>80.904987</td>
      <td>90.588593</td>
      <td>83.556977</td>
      <td>87.072785</td>
    </tr>
    <tr>
      <th>Large (Over 3000)</th>
      <td>80.919864</td>
      <td>77.063340</td>
      <td>81.059691</td>
      <td>66.464293</td>
      <td>73.761992</td>
    </tr>
  </tbody>
</table>
</div>



# Math and Reading Scores by Type of School


```python
scores_by_type
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Average Reading Score</th>
      <th>Average Math Score</th>
      <th>% Passing Reading</th>
      <th>% Passing Math</th>
      <th>Overall Passing Rate</th>
    </tr>
    <tr>
      <th>School Type</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Charter</th>
      <td>83.896421</td>
      <td>83.473852</td>
      <td>96.586489</td>
      <td>93.620830</td>
      <td>95.103660</td>
    </tr>
    <tr>
      <th>District</th>
      <td>80.966636</td>
      <td>76.956733</td>
      <td>80.799062</td>
      <td>66.548453</td>
      <td>73.673757</td>
    </tr>
  </tbody>
</table>
</div>


