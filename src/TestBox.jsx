import { useEffect, useState } from "react";
import { getRecommendedItems } from "./api/recommendation";
import { ExerciseQuestions, QuestionBox, OptionRadio } from "./components/ExerciseQuestions";

export default function TestBox() {

  const dummyQuestions = {
      "topic_id": 3,
      "title": "Dixie PIT: A Student-Run Coffee Shop",
      "content_text": "EDGEWOOD-Every morning at Dixie Heights High School, customers pour into a special experiment: the district's first coffee shop run mostly by students with special learning needs.\nWell before classes start, students and teachers order Lattes, Cappuccinos and Hot Chocolates. Then, during the first period, teachers call in orders on their room phones, and students make deliveries. By closing time at 9.20 a.m., the shop usually sells 90 drinks.\n\"Whoever made the chi tea, Ms. Schatzman says it was good,\" Christy McKinley, a second year student, announced recently, after hanging up with the teacher.\nThe shop is called the Dixie PIT, which stands for Power in Transition. Although some of the students are not disabled, many are, and the PIT helps them prepare for life after high school.\nThey learn not only how to run a coffee shop but also how to deal with their affairs. They keep a timecard and receive paychecks, which they keep in check registers.\nSpecial-education teachers Kim Chevalier and Sue Casey introduced the Dixie PIT from a similar  program at Kennesaw Mountain High School in Georgia.\nNot that it was easy. Chevalier's first problem to overcome was product-related. Should schools be selling coffee? What about sugar content?\nKenton County Food Service Director Ginger Gray helped. She made sure all the drinks, which use non-fat milk, fell within nutrition   guidelines.\nThe whole school has joined in to help.\nTeachers agreed to give up their l ounge   in the mornings. Art students painted the name of the shop on the wall. Business students designed the paychecks. The basketball team helped pay for cups.",
      "difficulty": 3,
      "num_words": 280,
      "num_questions": 5,
      "questions": [
        {
          "reading_id": 10,
          "question_text": "What is the text mainly about?",
          "option_a": "A best-selling coffee.",
          "option_b": "A special educational program.",
          "option_c": "Government support for schools.",
          "option_d": "A new type of teacher-student relationship.",
          "correct_option": 1,
          "explanation": "\"EDGEWOOD–Every morning at Dixie Heights High School, customers pour into a special experiment: the district's first coffee shop run mostly by students with special learning needs.\"",
          "order_index": 0,
          "id": 33
        },
        {
          "reading_id": 10,
          "question_text": "The Dixie PIT program was introduced in order to   _  .",
          "option_a": "raise money for school affairs",
          "option_b": "do some research on nutrition",
          "option_c": "develop students' practical skills",
          "option_d": "supply teachers with drinks",
          "correct_option": 2,
          "explanation": "\"Although some of the students are not disabled, many are, and the PIT helps them prepare for life after high school. They learn not only how to run a coffee shop but also how to deal with their affairs.\"",
          "order_index": 1,
          "id": 34
        },
        {
          "reading_id": 10,
          "question_text": "How did Christy McKinley know Ms. Schatzman's opinion of the chi tea?",
          "option_a": "She met her in the shop.",
          "option_b": "She heard her telling others.",
          "option_c": "She talked to her on the phone.",
          "option_d": "She went to her office to deliver the tea.",
          "correct_option": 2,
          "explanation": "\"Whoever made the chi tea, Ms. Schatzman says it was good,\" Christy McKinley, a second year student, announced recently, after hanging up with the teacher.'",
          "order_index": 2,
          "id": 35
        },
        {
          "reading_id": 10,
          "question_text": "We know from the text that Ginger Gray   _  .",
          "option_a": "manages the Dixie P1T program in Kenton County",
          "option_b": "sees that the drinks meet health standards",
          "option_c": "teaches at Dixie Heights High School",
          "option_d": "owns the school's coffee shop",
          "correct_option": 0,
          "explanation": "\"Kenton County Food Service Director Ginger Gray helped. She made sure all the drinks, which use non-fat milk, fell within nutrition guidelines.\"",
          "order_index": 3,
          "id": 36
        },
        {
          "reading_id": 10,
          "question_text": "Where can we usually read this passage?",
          "option_a": "In a novel.",
          "option_b": "In a newspaper.",
          "option_c": "In an instant message.",
          "option_d": "In a school report.",
          "correct_option": 1,
          "explanation": "\"EDGEWOOD–Every morning at Dixie Heights High School, customers pour into a special experiment: the district's first coffee shop run mostly by students with special learning needs.\"",
          "order_index": 4,
          "id": 37
        }
      ],
      "id": 10
    }
  
  const [answer, setAnswer] = useState({});

  const handleSelect = (qId, qOpt) => {
    setAnswer(prev => ({...prev, [qId]: qOpt}));
    console.log("Selected:", qId, optIdx);
  };

  return (
    <div>
      <ExerciseQuestions exercise={dummyQuestions} answers={answer} onSelect={handleSelect} />
    </div>
  );
}
